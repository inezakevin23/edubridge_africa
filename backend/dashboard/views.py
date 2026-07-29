from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.db.models import Sum
from accounts.permissions import IsCompany, IsIntern 
from challenges.models import Challenge, close_expired_challenges
from common.responses import api_response
from notifications.models import Notification
from submissions.models import Submission, SubmissionShortlist

from .serializers import (
    CompanyDashboardStatsSerializer,
    InternDashboardStatsSerializer,
)


class InternDashboardStatsView(APIView):
    permission_classes = [IsAuthenticated, IsIntern]

    def get(self, request):
        close_expired_challenges()
        user = request.user
        from django.db.models import Q
        
        active_challenges = Challenge.objects.filter(status="published").count()
        # Include submissions where user is the intern or a team member
        user_submissions = Submission.objects.filter(
            Q(intern=user) | Q(team__members__user=user)
        ).distinct()
        my_submissions = user_submissions.count()
        # Count individual shortlisted entries for this user across all their submissions.
        # Each shortlisted team member counts as one.
        shortlisted_submissions = SubmissionShortlist.objects.filter(
            user=user,
            submission__in=user_submissions,
        ).count()
        unread_notifications = Notification.objects.filter(recipient=user, is_read=False).count()
        score_stats = user_submissions.filter(
            company_score__isnull=False
        ).aggregate(total=Sum("company_score"))
        total_score_points = score_stats["total"] if score_stats["total"] is not None else 0   

        data = {
            "active_challenges": active_challenges,
            "my_submissions": my_submissions,
            "shortlisted_submissions": shortlisted_submissions,
            "unread_notifications": unread_notifications,
            "total_score_points": total_score_points,
        }

        serializer = InternDashboardStatsSerializer(data)

        return api_response(
            success=True,
            message="Intern dashboard statistics retrieved successfully.",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )


class CompanyDashboardStatsView(APIView):
    permission_classes = [IsAuthenticated, IsCompany]

    def get(self, request):
        close_expired_challenges()
        user = request.user
        active_challenges = Challenge.objects.filter(
            company__user=user, 
            status="published"
        ).count()

        company_submissions = Submission.objects.filter(challenge__company__user=user)

        total_submissions = company_submissions.count()
        reviewed_submissions = company_submissions.filter(company_score__isnull=False).count()
        # Count total individual shortlisted members across all company submissions
        shortlisted_submissions = SubmissionShortlist.objects.filter(
            submission__in=company_submissions,
        ).count()
        data = {
            "active_challenges": active_challenges,
            "total_submissions": total_submissions,
            "reviewed_submissions": reviewed_submissions,
            "shortlisted_submissions": shortlisted_submissions,
        }

        serializer = CompanyDashboardStatsSerializer(data)
        
        return api_response(
            success=True,
            message="Company dashboard statistics retrieved successfully.",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )
