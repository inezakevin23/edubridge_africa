import uuid
from datetime import timedelta
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from profiles.models import CompanyProfile, Industry, InternProfile
from .models import Challenge, ChallengeInvite, ChallengeTeam, TeamMember


class ChallengeModuleTests(APITestCase):

    def setUp(self):
        # 1. Setup Canonical Industry Group
        self.industry = Industry.objects.create(name="Technology")

        # 2. Setup Company User and Profile
        self.company_user = User.objects.create_user(
            email="employer@edubridge.africa",
            username="employer_brand",
            first_name="EduBridge",
            last_name="Employer",
            role=User.Roles.COMPANY,
            password="SecurePassword123!",
        )
        self.company_profile = CompanyProfile.objects.create(
            user=self.company_user,
            company_name="EduBridge Enterprise",
            business_type="startup",
            industry=self.industry,
            country="Rwanda",
            city="Kigali",
            description="Developing Pan-African workflows.",
            registration_certificate="dummy_cert.pdf", # Bypasses validator checks on direct model seeds
        )

        # 3. Setup Second Company User (for Ownership/Permission Checks)
        self.other_company_user = User.objects.create_user(
            email="other@company.com",
            username="other_brand",
            first_name="Other",
            last_name="Company",
            role=User.Roles.COMPANY,
            password="SecurePassword123!",
        )
        self.other_company_profile = CompanyProfile.objects.create(
            user=self.other_company_user,
            company_name="Rival Enterprise",
            business_type="corporate",
            industry=self.industry,
            country="Kenya",
            city="Nairobi",
            description="Other company description.",
            registration_certificate="dummy_cert.pdf",
        )

        # 4. Setup Two Intern Users and Profiles
        self.intern_leader_user = User.objects.create_user(
            email="leader@intern.com",
            username="tech_leader",
            first_name="John",
            last_name="Doe",
            role=User.Roles.INTERN,
            password="SecurePassword123!",
        )
        self.intern_leader_profile = InternProfile.objects.create(
            user=self.intern_leader_user,
            country="Rwanda",
            city="Kigali",
            date_of_birth="2000-01-01",
            gender="male",
            current_status="graduate",
            skills="Python, Django, PostgreSQL",
            national_or_student_id_document="id.pdf",
            profile_picture="pic.jpg",
        )

        self.intern_invitee_user = User.objects.create_user(
            email="invitee@intern.com",
            username="tech_collaborator",
            first_name="Jane",
            last_name="Smith",
            role=User.Roles.INTERN,
            password="SecurePassword123!",
        )
        self.intern_invitee_profile = InternProfile.objects.create(
            user=self.intern_invitee_user,
            country="Rwanda",
            city="Kigali",
            date_of_birth="2001-05-05",
            gender="female",
            current_status="student",
            skills="React, TypeScript, CSS",
            national_or_student_id_document="id2.pdf",
            profile_picture="pic2.jpg",
        )

        # 5. Create a Base Seed Challenge
        self.challenge = Challenge.objects.create(
            title="AI Innovation Challenge",
            description="Build an automated backend optimization loop.",
            company=self.company_profile,
            industry=self.industry,
            submission_deadline="2026-12-31T23:59:59Z",
            skills="Python, AI",
            status="published",
        )

        # Base API URL Path Registries
        self.list_url = reverse("challenge-list")
        self.create_url = reverse("challenge-create")
        self.create_team_url = reverse("create-team")
        self.invite_url = reverse("create-invite")

    # CORE CHALLENGE ENDPOINT TESTS

    def test_anonymous_user_can_list_published_challenges(self):
        """Verifies public clients can access published hackathons."""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["success"])
        self.assertEqual(len(response.data["data"]["results"]), 1)

    def test_expired_challenge_is_closed_and_hidden_from_browse_results(self):
        self.challenge.submission_deadline = timezone.now() - timedelta(minutes=1)
        self.challenge.save(update_fields=["submission_deadline"])

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["data"]["results"]), 0)
        self.challenge.refresh_from_db()
        self.assertEqual(self.challenge.status, "closed")

    def test_company_can_create_challenge(self):
        """Verifies authentic companies can seed fully formed tasks."""
        self.client.force_authenticate(user=self.company_user)
        payload = {
            "title": "Backend Engineering Masterclass",
            "description": "Design an elegant decoupled microservice engine.",
            "industry": self.industry.id,
            "submission_deadline": "2026-11-30T12:00:00Z",
            "skills": "Django, Docker, Redis",
            "status": "published",
            "submission_formats": ["Code Repository"],
            "requirements": [
                {"description": "Must provide a complete docker-compose file.", "order": 1},
                {"description": "All endpoints must utilize custom api_responses.", "order": 2}
            ]
        }
        response = self.client.post(self.create_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["data"]["title"], "Backend Engineering Masterclass")

    def test_intern_cannot_create_challenge(self):
        """Verifies role permissions block interns from launching challenges."""
        self.client.force_authenticate(user=self.intern_leader_user)
        payload = {"title": "Illegal Challenge"}
        response = self.client.post(self.create_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(response.data["success"])

    def test_only_owner_company_can_update_challenge(self):
        """Tests object ownership lock configurations on editing features."""
        update_url = reverse("challenge-update", kwargs={"pk": self.challenge.id})
        
        # Complete valid challenge data payload
        payload = {
            "title": "Altered AI Innovation Challenge", 
            "description": "Updated challenge description block context.",
            "submission_deadline": "2026-12-31T23:59:59Z",
            "industry": self.industry.id,
            "skills": "Python, AI, Django",
        }

        # Unauthorized Company Attempt
        self.client.force_authenticate(user=self.other_company_user)
        response = self.client.put(update_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Authorized Owner Company Attempt
        self.client.force_authenticate(user=self.company_user)
        response = self.client.put(update_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"]["title"], "Altered AI Innovation Challenge")

    # TEAM AND COLLABORATION TESTS

    def test_intern_can_create_challenge_team(self):
        """Verifies basic team initiation workflows for talent users."""
        self.client.force_authenticate(user=self.intern_leader_user)
        payload = {"challenge": self.challenge.id}
        response = self.client.post(self.create_team_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["success"])
        
        # Verify leader was automatically bundled inside members inline list
        self.assertEqual(len(response.data["data"]["members"]), 1)
        self.assertEqual(response.data["data"]["leader"], self.intern_leader_user.id)

    def test_cannot_create_duplicate_challenge_team(self):
        """Ensures logic blocks leaders from building multiple teams for one task."""
        self.client.force_authenticate(user=self.intern_leader_user)
        ChallengeTeam.objects.create(challenge=self.challenge, leader=self.intern_leader_user)
        
        payload = {"challenge": self.challenge.id}
        response = self.client.post(self.create_team_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data["success"])

    # INVITATION LIFECYCLE TESTS 

    def test_team_leader_can_invite_collaborator(self):
        """Verifies secure invitation processing pipeline parameters."""
        self.client.force_authenticate(user=self.intern_leader_user)
        team = ChallengeTeam.objects.create(challenge=self.challenge, leader=self.intern_leader_user)
        TeamMember.objects.create(team=team, user=self.intern_leader_user)

        payload = {
            "team": team.id,
            "receiver": self.intern_invitee_user.id
        }
        response = self.client.post(self.invite_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["data"]["status"], "pending")

    def test_cannot_invite_beyond_the_challenge_team_limit(self):
        self.challenge.max_team_size = 1
        self.challenge.save(update_fields=["max_team_size"])
        team = ChallengeTeam.objects.create(
            challenge=self.challenge,
            leader=self.intern_leader_user,
        )
        TeamMember.objects.create(team=team, user=self.intern_leader_user)

        self.client.force_authenticate(user=self.intern_leader_user)
        response = self.client.post(
            self.invite_url,
            {"team": team.id, "receiver": self.intern_invitee_user.id},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("team", response.data["errors"])

    def test_invitee_can_accept_invitation(self):
        """Tests the database state changes and transaction blocks on acceptance."""
        team = ChallengeTeam.objects.create(challenge=self.challenge, leader=self.intern_leader_user)
        invite = ChallengeInvite.objects.create(
            team=team, sender=self.intern_leader_user, receiver=self.intern_invitee_user, status="pending"
        )

        accept_url = reverse("accept-invite", kwargs={"pk": invite.id})
        self.client.force_authenticate(user=self.intern_invitee_user)
        response = self.client.post(accept_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["success"])
