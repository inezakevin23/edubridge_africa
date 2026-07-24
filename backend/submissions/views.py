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

from .models import Submission
from .serializers import (
    CreateSubmissionSerializer,
    ReviewSerializer,
    SubmissionSerializer,
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
        return (
            Submission.objects
            .filter(intern=self.request.user)
            .select_related("challenge")
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
            return Submission.objects.filter(intern=user)
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
        shortlisted = submissions.filter(shortlisted=True).count()
        under_review = submissions.filter(status=Submission.Status.UNDER_REVIEW).count()
        
        average_score = submissions.filter(company_score__isnull=False).aggregate(
            average=Avg("company_score")
        )["average"]
        
        if average_score is not None:
            average_score = round(average_score, 2)

        data = {
            "total_submissions": total_submissions,
            "shortlisted": shortlisted,
            "under_review": under_review,
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
        submissions = Submission.objects.filter(challenge=challenge, shortlisted=True).select_related("intern")
        
        notified_count = 0
        for submission in submissions:
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
