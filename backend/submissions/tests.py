import uuid
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from challenges.models import Challenge
from profiles.models import CompanyProfile, Industry
from .models import Submission


class SubmissionModuleTests(APITestCase):

    def setUp(self):
        # 1. Setup Canonical Industry Group
        self.industry = Industry.objects.create(name="Data Science")

        # 2. Setup Company User and Profile
        self.company_user = User.objects.create_user(
            email="judge@edubridge.africa",
            username="evaluator_corp",
            first_name="EduBridge",
            last_name="Reviewer",
            role=User.Roles.COMPANY,
            password="SecurePassword123!",
        )
        self.company_profile = CompanyProfile.objects.create(
            user=self.company_user,
            company_name="EduBridge Analytics",
            business_type="corporation",
            industry=self.industry,
            country="Rwanda",
            city="Kigali",
            description="Corporate metrics reviewer engines.",
            registration_certificate="cert.pdf",
        )

        # 3. Setup Intern User Account
        self.intern_user = User.objects.create_user(
            email="competitor@intern.com",
            username="hacker_talent",
            first_name="Alex",
            last_name="Rwanda",
            role=User.Roles.INTERN,
            password="SecurePassword123!",
        )

        # 4. Setup Second Intern User (for Multi-Account Isolation Checks)
        self.other_intern = User.objects.create_user(
            email="rival@intern.com",
            username="rival_talent",
            first_name="Eric",
            last_name="Munyaneza",
            role=User.Roles.INTERN,
            password="SecurePassword123!",
        )

        # 5. Seed an Open, Valid Challenge Task (Deadline far in the future)
        self.open_challenge = Challenge.objects.create(
            title="Predictive Modeling Hackathon",
            description="Construct a regression network targeting crop yields.",
            company=self.company_profile,
            industry=self.industry,
            submission_deadline=timezone.now() + timedelta(days=5),
            cash_prize=1000.00,
            skills="Python, Pandas, ML",
            status="published",
        )

        # 6. Seed a Closed Challenge Task (Deadline set 2 hours in the past)
        self.expired_challenge = Challenge.objects.create(
            title="Legacy Scripting Challenge",
            description="Optimize parsing speeds on binary datasets.",
            company=self.company_profile,
            industry=self.industry,
            submission_deadline=timezone.now() - timedelta(hours=2),
            cash_prize=500.00,
            skills="Bash, C++",
            status="published",
        )

        # Mock Document Asset Payload Generation (Valid text document block)
        self.valid_doc = SimpleUploadedFile("solution_report.pdf", b"pdf stream data block", content_type="application/pdf")

        # Core API Endpoints Path Registries
        self.submit_url = reverse("create-submission")
        self.stats_url = reverse("company-submission-statistics")

    #  DEADLINE AND ROLE FIREWALL TESTS 

    def test_intern_can_post_valid_submission_before_deadline(self):
        """Verifies that clear, authorized candidates can safely log hackathon entries."""
        self.client.force_authenticate(user=self.intern_user)
        payload = {
            "challenge": self.open_challenge.id,
            "title": "Ensemble Forest Model Proposal",
            "summary": "Achieved a 94.2% accuracy threshold using random forest variations.",
            "report_file": self.valid_doc,
            "report_link": "https://github.com",
        }
        response = self.client.post(self.submit_url, payload, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["data"]["status"], "submitted")

    def test_deadline_firewall_blocks_late_submissions(self):
        """Verifies your timezone-aware validate() hook completely bars past-due entries."""
        self.client.force_authenticate(user=self.intern_user)
        payload = {
            "challenge": self.expired_challenge.id, # Closed hours ago
            "title": "Late Solution Entry",
            "summary": "Attempting to push data past operational schedule rules.",
            "report_file": self.valid_doc,
        }
        response = self.client.post(self.submit_url, payload, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data["success"])
        self.assertIn("detail", response.data["errors"])

    def test_cannot_submit_duplicate_project_entries(self):
        """Ensures unique constraints prevent individual users from overriding existing entries."""
        self.client.force_authenticate(user=self.intern_user)
        # Pre-seed initial solution record
        Submission.objects.create(
            challenge=self.open_challenge, intern=self.intern_user,
            title="First Entry", summary="Summary data block."
        )
        payload = {
            "challenge": self.open_challenge.id,
            "title": "Second Forbidden Attempt",
            "summary": "Should be caught by your unique validation loop.",
        }
        response = self.client.post(self.submit_url, payload, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # GRADING AND CASH PRIZE VALIDATION TESTS 

    def test_company_can_grade_and_review_submission(self):
        """Tests corporate review mechanisms and evaluation state engines."""
        submission = Submission.objects.create(
            challenge=self.open_challenge, intern=self.intern_user,
            title="Intern Proposal", summary="Summary data block."
        )
        review_url = reverse("review-submission", kwargs={"id": submission.id})
        
        self.client.force_authenticate(user=self.company_user)
        payload = {
            "company_score": 88,
            "feedback": "Outstanding architectural foresight and clean testing loops.",
            "shortlisted": True,
        }
        response = self.client.put(review_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Confirm model state auto-transitioned from 'Submitted' to 'Reviewed'
        self.assertEqual(response.data["data"]["status"], "reviewed")

    def test_cash_prize_cannot_exceed_challenge_limit(self):
        """Ensures corporate entities cannot award funds exceeding pool boundaries."""
        submission = Submission.objects.create(
            challenge=self.open_challenge, intern=self.intern_user,
            title="Intern Proposal", summary="Summary data block."
        )
        review_url = reverse("review-submission", kwargs={"id": submission.id})
        
        self.client.force_authenticate(user=self.company_user)
        payload = {
            "cash_prize_awarded": 1500.00,  # Exceeds the challenge max prize limit of $1000
        }
        response = self.client.put(review_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("cash_prize_awarded", response.data["errors"])

    # ADMINISTRATIVE STATISTICS DASHBOARD TESTS 
    def test_company_can_query_submission_statistics(self):
        """Validates that matrix aggregations return clean numeric analytics objects."""
        submission = Submission.objects.create(
            challenge=self.open_challenge, intern=self.intern_user,
            title="Proposal Alpha", summary="Data.", company_score=90, shortlisted=True
        )
        Submission.objects.create(
            challenge=self.open_challenge, intern=self.other_intern,
            title="Proposal Beta", summary="Data.", company_score=80, status="under_review"
        )

        self.client.force_authenticate(user=self.company_user)
        response = self.client.get(self.stats_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"]["total_submissions"], 2)
        self.assertEqual(response.data["data"]["shortlisted"], 1)
        self.assertEqual(response.data["data"]["under_review"], 1)
        self.assertEqual(response.data["data"]["average_score"], 85.00)
    