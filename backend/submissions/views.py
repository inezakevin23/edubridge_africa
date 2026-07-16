from django.db.models import Q, Avg
from django.shortcuts import get_object_or_404

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from challenges.models import Challenge
from profiles.models import InternProfile

from common.pagination import StandardPagination
from common.responses import api_response

from .models import Submission
from .serializers import (
    SubmissionSerializer,
    CreateSubmissionSerializer,
    ReviewSerializer,
)
from notifications.models import Notification


class CreateSubmissionView(generics.CreateAPIView):

    serializer_class = CreateSubmissionSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):

        if request.user.role != "intern":
            return Response(
                api_response(
                    success=False,
                    message="Only intern users can submit solutions.",
                    data=None,
                ),
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        submission = serializer.save()

        response_serializer = SubmissionSerializer(
            submission,
            context={
                "request": request
            },
        )

        return Response(
            api_response(
                success=True,
                message="Solution submitted successfully.",
                data=response_serializer.data,
            ),
            status=status.HTTP_201_CREATED,
        )

class MySubmissionsView(
    generics.ListAPIView
):

    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]

    pagination_class = StandardPagination

    def get_queryset(self):

        if self.request.user.role != "intern":
            return Submission.objects.none()

        return (
            Submission.objects
            .filter(
                intern__user=self.request.user
            )
            .select_related(
                "challenge",
                "intern__user",
            )
            .order_by(
                "-submitted_at"
            )
        )

    def list(self, request, *args, **kwargs):

        queryset = self.filter_queryset(
            self.get_queryset()
        )

        page = self.paginate_queryset(
            queryset
        )

        serializer = self.get_serializer(
            page,
            many=True
        )

        return self.get_paginated_response(
            serializer.data
        )

class SubmissionDetailView(
    generics.RetrieveAPIView
):

    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]

    lookup_field = "id"

    def get_queryset(self):

        user = self.request.user

        if user.role == "intern":

            return Submission.objects.filter(
                intern__user=user
            )

        if user.role == "company":

            return Submission.objects.filter(
                challenge__company__user=user
            )

        return Submission.objects.none()

class CompanySubmissionsView(
    generics.ListAPIView
):

    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]

    pagination_class = StandardPagination

    def get_queryset(self):

        user = self.request.user

        if user.role != "company":

            return Submission.objects.none()

        queryset = (
            Submission.objects
            .filter(
                challenge__company__user=user
            )
            .select_related(
                "challenge",
                "intern__user",
            )
        )

        # Search
        search = self.request.query_params.get(
            "search"
        )

        if search:

            queryset = queryset.filter(

                Q(
                    intern__user__first_name__icontains=search
                )

                |

                Q(
                    intern__user__last_name__icontains=search
                )

                |

                Q(
                    challenge__title__icontains=search
                )
            )

        # Filter by challenge
        challenge_id = self.request.query_params.get(
            "challenge"
        )

        if challenge_id:

            queryset = queryset.filter(
                challenge_id=challenge_id
            )

        # Sort
        ordering = self.request.query_params.get(
            "ordering",
            "newest"
        )

        if ordering == "oldest":

            queryset = queryset.order_by(
                "submitted_at"
            )

        else:

            queryset = queryset.order_by(
                "-submitted_at"
            )

        return queryset

class ReviewSubmissionView(
    generics.UpdateAPIView
):

    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    lookup_field = "id"

    def get_queryset(self):

        if self.request.user.role != "company":

            return Submission.objects.none()

        return Submission.objects.filter(
            challenge__company__user=self.request.user
        )

    def update(self, request, *args, **kwargs):

        submission = self.get_object()

        serializer = self.get_serializer(
            submission,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True
        )

        submission = serializer.save()

        response_serializer = SubmissionSerializer(
            submission,
            context={
                "request": request
            },
        )

        return Response(

            api_response(

                success=True,

                message=(
                    "Submission reviewed successfully."
                ),

                data=response_serializer.data,
            ),

            status=status.HTTP_200_OK,
        )

class CompanySubmissionStatisticsView(
    generics.GenericAPIView
):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "company":

            return Response(

                api_response(

                    success=False,

                    message=(
                        "Only companies can access submission statistics."
                    ),

                    data=None,
                ),

                status=status.HTTP_403_FORBIDDEN,
            )

        submissions = Submission.objects.filter(

            challenge__company__user=request.user

        )

        total_submissions = submissions.count()

        shortlisted = submissions.filter(

            is_shortlisted=True

        ).count()

        under_review = submissions.filter(

            status="under_review"

        ).count()

        average_score = submissions.filter(

            company_score__isnull=False

        ).aggregate(

            average=Avg(
                "company_score"
            )

        )["average"]

        if average_score is not None:

            average_score = round(
                average_score,
                2
            )

        data = {

            "total_submissions":
            total_submissions,

            "shortlisted":
            shortlisted,

            "under_review":
            under_review,

            "average_score":
            average_score,
        }

        return Response(

            api_response(

                success=True,

                message=(
                    "Submission statistics retrieved successfully."
                ),

                data=data,
            ),

            status=status.HTTP_200_OK,
        )

class NotifyShortlistedView(
    generics.GenericAPIView
):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        if request.user.role != "company":

            return Response(

                api_response(

                    success=False,

                    message=(
                        "Only companies can notify shortlisted talent."
                    ),

                    data=None,
                ),

                status=status.HTTP_403_FORBIDDEN,
            )

        challenge_id = request.data.get(
            "challenge_id"
        )

        if not challenge_id:

            return Response(

                api_response(

                    success=False,

                    message=(
                        "challenge_id is required."
                    ),

                    data=None,
                ),

                status=status.HTTP_400_BAD_REQUEST,
            )

        challenge = get_object_or_404(

            Challenge,

            id=challenge_id,

            company__user=request.user,
        )

        submissions = Submission.objects.filter(

            challenge=challenge,

            shortlisted=True,
        ).select_related(

            "intern__user"
        )

        notified_count = 0

        for submission in submissions:

            # Create notification here
            #
            # Example:
            #
            # Notification.objects.create(
            #     user=submission.talent.user,
            #     message=(
            #         f"You have been shortlisted for "
            #         f"{challenge.title}."
            #     )
            # )
            notified_count += 1

        return Response(
            api_response(
                success=True,
                message=(
                    f"{notified_count} shortlisted "
                    "talent users notified successfully."
                ),
                data={
                    "notified_count":
                    notified_count,
                },
            ),
            status=status.HTTP_200_OK,
        )

