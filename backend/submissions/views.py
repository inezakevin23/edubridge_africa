from django.db import IntegrityError
from django.db.models import Avg, Q
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated

from accounts.models import User
from accounts.permissions import IsCompany, IsIntern
from challenges.models import Challenge
from common.pagination import StandardPagination
from common.responses import api_response
from notifications.models import Notification

from .models import Submission, SubmissionShortlist
from .serializers import (
    CreateSubmissionSerializer,
    ReviewSerializer,
    ShortlistToggleSerializer,
    SubmissionSerializer,
)


class SubmissionShortlistToggleView(generics.GenericAPIView):
    """Toggle shortlist status for a specific user on a submission.
    
    Company can shortlist one or many team members from a group submission.
    """
    serializer_class = ShortlistToggleSerializer
    permission_classes = [IsAuthenticated, IsCompany]

    def get_object(self, submission_id):
        try:
            submission = Submission.objects.get(id=submission_id)
        except Submission.DoesNotExist:
            return None
        # Ensure the company owns the challenge this submission belongs to
        if submission.challenge.company.user != self.request.user:
            return None
        return submission

    def post(self, request, submission_id):
        submission = self.get_object(submission_id)
        if not submission:
            return api_response(
                success=False,
                message="Submission not found or access denied.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(
            data=request.data,
            context={"submission": submission},
        )
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user_id"]
        should_shortlist = serializer.validated_data["shortlisted"]

        if should_shortlist:
            # Mark the submission-level shortlisted field as well for backward compatibility
            if not submission.shortlisted:
                submission.shortlisted = True
                submission.save(update_fields=["shortlisted"])

            SubmissionShortlist.objects.get_or_create(
                submission=submission,
                user=user,
            )
            message = f"{user.get_full_name() or user.email} has been shortlisted."
        else:
            SubmissionShortlist.objects.filter(
                submission=submission,
                user=user,
            ).delete()
            # If no more shortlist entries, reset the submission-level shortlisted flag
            if not SubmissionShortlist.objects.filter(submission=submission).exists():
                submission.shortlisted = False
                submission.save(update_fields=["shortlisted"])
            message = f"{user.get_full_name() or user.email} has been removed from shortlist."

        response_serializer = SubmissionSerializer(submission, context={"request": request})
        return api_response(
            success=True,
            message=message,
            data=response_serializer.data,
            status_code=status.HTTP_200_OK,
        )


class CreateSubmissionView(generics.CreateAPIView):
    serializer_class = CreateSubmissionSerializer
    permission_classes = [IsAuthenticated, IsIntern] 

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        try:
            submission = serializer.save()
        except IntegrityError:
            return api_response(
                success=False,
                message="You have already submitted a solution for this challenge. You can update your existing submission instead.",
                status_code=status.HTTP_409_CONFLICT,
            )
        response_serializer = SubmissionSerializer(submission, context={"request": request})
        
        return api_response(
            success=True,
            message="Solution submitted successfully.",
            data=response_serializer.data,
            status_code=status.HTTP_201_CREATED,
        )


class MySubmissionsView(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated, IsIntern]
    pagination_class = StandardPagination

    def get_queryset(self):
        user = self.request.user
        # Include submissions where user is the submitter OR where user is a team member
        return (
            Submission.objects
            .filter(
                Q(intern=user) | Q(team__members__user=user)
            )
            .select_related("challenge")
            .prefetch_related("shortlist_entries")
            .distinct()
            .order_by("-created_at")
        )

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class SubmissionDetailView(generics.RetrieveAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    def get_queryset(self):
        user = self.request.user
        if user.role == User.Roles.INTERN:
            return Submission.objects.filter(
                Q(intern=user) | Q(team__members__user=user)
            ).distinct()
        if user.role == User.Roles.COMPANY:
            return Submission.objects.filter(challenge__company__user=user)
        return Submission.objects.none()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(
            success=True,
            message="Submission details retrieved successfully.",
            data=serializer.data,
        )


class CompanySubmissionsView(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated, IsCompany]
    pagination_class = StandardPagination

    def get_queryset(self):
        user = self.request.user
        queryset = (
            Submission.objects
            .filter(challenge__company__user=user)
            .select_related("challenge", "intern")
        )

        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                Q(intern__first_name__icontains=search) | 
                Q(intern__last_name__icontains=search) | 
                Q(challenge__title__icontains=search)
            )

        challenge_id = self.request.query_params.get("challenge")
        if challenge_id:
            queryset = queryset.filter(challenge_id=challenge_id)

        shortlisted_param = self.request.query_params.get("shortlisted")
        if shortlisted_param is not None:
            if shortlisted_param.lower() in ("true", "1", "yes"):
                queryset = queryset.filter(
                    Q(shortlisted=True) | Q(shortlist_entries__isnull=False)
                ).distinct()
            elif shortlisted_param.lower() in ("false", "0", "no"):
                queryset = queryset.filter(
                    shortlisted=False, shortlist_entries__isnull=True
                )

        ordering = self.request.query_params.get("ordering", "newest")
        if ordering == "oldest":
            queryset = queryset.order_by("created_at")
        else:
            queryset = queryset.order_by("-created_at")
        return queryset

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class ReviewSubmissionView(generics.UpdateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated, IsCompany]
    lookup_field = "id"

    def get_queryset(self):
        return Submission.objects.filter(challenge__company__user=self.request.user)

    def update(self, request, *args, **kwargs):
        submission = self.get_object()
        serializer = self.get_serializer(submission, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        submission = serializer.save()

        response_serializer = SubmissionSerializer(submission, context={"request": request})
        return api_response(
            success=True,
            message="Submission reviewed successfully.",
            data=response_serializer.data,
            status_code=status.HTTP_200_OK,
        )


class CompanySubmissionStatisticsView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, IsCompany]

    def get(self, request):
        submissions = Submission.objects.filter(challenge__company__user=request.user)
        total_submissions = submissions.count()
        # Count total individual shortlisted members across all company submissions
        shortlisted = SubmissionShortlist.objects.filter(
            submission__in=submissions,
        ).count()
        pending_review = submissions.filter(status=Submission.Status.SUBMITTED).count()
        
        average_score = submissions.filter(company_score__isnull=False).aggregate(
            average=Avg("company_score")
        )["average"]
        
        if average_score is not None:
            average_score = round(average_score, 2)

        data = {
            "total_submissions": total_submissions,
            "shortlisted": shortlisted,
            "pending_review": pending_review,
            "average_score": average_score,
        }
        return api_response(
            success=True,
            message="Submission statistics retrieved successfully.",
            data=data,
            status_code=status.HTTP_200_OK,
        )


class NotifyShortlistedView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, IsCompany]

    def post(self, request):
        challenge_id = request.data.get("challenge_id")
        if not challenge_id:
            return api_response(
                success=False,
                message="challenge_id is required.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        challenge = get_object_or_404(Challenge, id=challenge_id, company__user=request.user)
        # Get submissions that have at least one shortlisted member
        submissions = Submission.objects.filter(
            challenge=challenge,
            shortlisted=True,
        ).prefetch_related("shortlist_entries__user")
        
        notified_count = 0
        for submission in submissions:
            # Collect all shortlisted users for this submission (prefetched)
            shortlist_entries = submission.shortlist_entries.all()
            if shortlist_entries:
                for entry in shortlist_entries:
                    Notification.objects.create(
                        recipient=entry.user,
                        title="Challenge Shortlist Selection",
                        message=f"Congratulations! Your project entry for the challenge '{challenge.title}' has been successfully shortlisted.",
                        notification_type=Notification.NotificationType.CHALLENGE_SHORTLIST if hasattr(Notification.NotificationType, 'CHALLENGE_SHORTLIST') else "shortlist",
                        related_object_id=submission.id,
                    )
                    notified_count += 1
            else:
                # Fallback: if submission is shortlisted but no per-member entries exist,
                # notify the intern who submitted (backward compatibility)
                Notification.objects.create(
                    recipient=submission.intern,
                    title="Challenge Shortlist Selection",
                    message=f"Congratulations! Your project entry for the challenge '{challenge.title}' has been successfully shortlisted.",
                    notification_type=Notification.NotificationType.CHALLENGE_SHORTLIST if hasattr(Notification.NotificationType, 'CHALLENGE_SHORTLIST') else "shortlist",
                    related_object_id=submission.id,
                )
                notified_count += 1

        return api_response(
            success=True,
            message=f"{notified_count} shortlisted talent users notified successfully.",
            data={"notified_count": notified_count},
            status_code=status.HTTP_200_OK,
        )
