import uuid
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from challenges.models import Challenge
from notifications.models import Notification
from profiles.models import CompanyProfile, Industry
from submissions.models import Submission


class DashboardModuleTests(APITestCase):

    def setUp(self):
        # 1. Setup Base Infrastructure Fields
        self.industry = Industry.objects.create(name="Engineering")

        # 2. Setup Company Profile Seed
        self.company_user = User.objects.create_user(
            email="ceo@enterprise.com",
            username="enterprise_ceo",
            first_name="Alpha",
            last_name="Corp",
            role=User.Roles.COMPANY,
            password="SecurePassword123!",
        )
        self.company_profile = CompanyProfile.objects.create(
            user=self.company_user,
            company_name="Alpha Corporation",
            business_type="corporation",
            industry=self.industry,
            country="Rwanda",
            city="Kigali",
            description="Enterprise Dashboard Testing Matrix.",
            registration_certificate="cert.pdf",
        )

        # 3. Setup Intern User Seed
        self.intern_user = User.objects.create_user(
            email="intern@talent.com",
            username="intern_dev",
            first_name="John",
            last_name="Doe",
            role=User.Roles.INTERN,
            password="SecurePassword123!",
        )

        # 4. Seed 2 Active Published Challenges for the Company
        self.challenge_1 = Challenge.objects.create(
            title="Challenge 1", description="Desc", company=self.company_profile,
            industry=self.industry, submission_deadline="2027-12-31T23:59:59Z",
            skills="Python", status="published"
        )
        self.challenge_2 = Challenge.objects.create(
            title="Challenge 2", description="Desc", company=self.company_profile,
            industry=self.industry, submission_deadline="2027-12-31T23:59:59Z",
            skills="Django", status="published"
        )

        # 5. Seed Submissions (1 Graded & Shortlisted, 1 Ungraded/Under Review)
        self.submission_1 = Submission.objects.create(
            challenge=self.challenge_1, intern=self.intern_user,
            title="Submission 1", summary="Data summary.",
            company_score=95, shortlisted=True, status="reviewed"
        )
        self.submission_2 = Submission.objects.create(
            challenge=self.challenge_2, intern=self.intern_user,
            title="Submission 2", summary="Data summary.",
            status="under_review"
        )

        # 6. Seed 3 Unread Notifications for the Intern
        for i in range(3):
            Notification.objects.create(
                recipient=self.intern_user,
                title=f"Notification {i}",
                message="Alert context string.",
                notification_type=Notification.NotificationType.CHALLENGE_INVITATION,
                is_read=False
            )

        # API Path Registries
        self.intern_stats_url = reverse("intern-dashboard-stats")
        self.company_stats_url = reverse("company-dashboard-stats")

    # INTERN DASHBOARD METRICS EVALUATIONS

    def test_intern_can_query_accurate_dashboard_metrics(self):
        """Verifies that math lookups aggregate intern metrics into correct parameters."""
        self.client.force_authenticate(user=self.intern_user)
        response = self.client.get(self.intern_stats_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["data"]["active_challenges"], 2)
        self.assertEqual(response.data["data"]["my_submissions"], 2)
        self.assertEqual(response.data["data"]["shortlisted_submissions"], 1)
        self.assertEqual(response.data["data"]["unread_notifications"], 3)

    def test_role_firewall_blocks_company_from_intern_dashboard(self):
        """Ensures corporate accounts cannot query talent analytic endpoints."""
        self.client.force_authenticate(user=self.company_user)
        response = self.client.get(self.intern_stats_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    #  COMPANY DASHBOARD METRICS EVALUATIONS 

    def test_company_can_query_accurate_dashboard_metrics(self):
        """Verifies that query count calculations compile corporate logs accurately."""
        self.client.force_authenticate(user=self.company_user)
        response = self.client.get(self.company_stats_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["data"]["active_challenges"], 2)
        self.assertEqual(response.data["data"]["total_submissions"], 2)
        self.assertEqual(response.data["data"]["reviewed_submissions"], 1) # Only submission_1 has score
        self.assertEqual(response.data["data"]["shortlisted_submissions"], 1)

    def test_role_firewall_blocks_intern_from_company_dashboard(self):
        """Ensures intern accounts are forcefully locked out of employer dashboards."""
        self.client.force_authenticate(user=self.intern_user)
        response = self.client.get(self.company_stats_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
