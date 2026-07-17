import io
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from PIL import Image
import io
from accounts.models import User
from .models import CompanyProfile, CompanyRepresentative, Industry, InternProfile


class ProfileModuleTests(APITestCase):

    def setUp(self):
        # 1. Setup Canonical Industry Group
        self.industry = Industry.objects.create(name="Finance")

        # 2. Setup Base Intern User (No profile seeded yet)
        self.intern_user = User.objects.create_user(
            email="talent@edubridge.africa",
            username="talent_intern",
            first_name="Kevin",
            last_name="Doe",
            role=User.Roles.INTERN,
            password="SecurePassword123!",
        )

        # 3. Setup Base Company User (No profile seeded yet)
        self.company_user = User.objects.create_user(
            email="hr@edubridge.africa",
            username="hr_brand",
            first_name="EduBridge",
            last_name="HR",
            role=User.Roles.COMPANY,
            password="SecurePassword123!",
        )

        # 4. Generate Mock Files for Payload Tests
        # Valid Mock Image (1x1 PNG data payload)
        avatar_buffer = io.BytesIO()
        img = Image.new("RGB", (100, 100), color="blue")
        img.save(avatar_buffer, format="JPEG")
        avatar_buffer.seek(0)
        self.valid_image = SimpleUploadedFile(
            "avatar.jpg", 
            avatar_buffer.read(), 
            content_type="image/jpeg"
        )
        self.valid_pdf = SimpleUploadedFile("resume.pdf", b"dummy pdf content", content_type="application/pdf")
        # Invalid Mock Extensions to trigger your custom validators.py file checks
        self.invalid_file_ext = SimpleUploadedFile("malicious.exe", b"exe binary payload", content_type="application/x-msdownload")
        
        # Oversized File Block (6 Megabytes)
        self.oversized_file = SimpleUploadedFile("bloated.pdf", b"0" * (6 * 1024 * 1024), content_type="application/pdf")

        # URL API Endpoints Registries
        self.industry_list_url = reverse("industry-list")
        self.intern_create_url = reverse("intern-profile-create")
        self.intern_me_url = reverse("intern-profile")
        self.company_create_url = reverse("company-profile-create")
        self.company_me_url = reverse("company-profile")

    #  INDUSTRY LOOKUP TESTS

    def test_authenticated_user_can_list_industries(self):
        """Verifies that dropdown selection lookups pull pure unfiltered arrays."""
        self.client.force_authenticate(user=self.intern_user)
        response = self.client.get(self.industry_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["success"])
        self.assertEqual(len(response.data["data"]), 1)

    #  INTERN PROFILE LIFECYCLE TESTS 

    def test_intern_can_create_valid_profile(self):
        """Verifies that authenticated interns can safely upload onboarding steps."""
        self.client.force_authenticate(user=self.intern_user)
        payload = {
            "country": "Rwanda",
            "city": "Kigali",
            "date_of_birth": "2002-10-15",
            "gender": "male",
            "current_status": "student",
            "institution": "University of Rwanda",
            "field_of_study": "Computer Science",
            "skills": "Python, DRF",
            "national_or_student_id_document": self.valid_pdf,
            "profile_picture": self.valid_image,
        }
        # Multi-part format is mandatory when attaching file payloads
        response = self.client.post(self.intern_create_url, payload, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["data"]["city"], "Kigali")

    def test_cannot_create_duplicate_intern_profile(self):
        """Ensures your validation engine handles hasattr() blocks to halt duplicate profile rows."""
        self.client.force_authenticate(user=self.intern_user)
        # Create initial profile manually
        InternProfile.objects.create(
            user=self.intern_user, country="Rwanda", city="Kigali", date_of_birth="2002-10-15",
            gender="male", current_status="student", skills="Python",
            national_or_student_id_document=self.valid_pdf, profile_picture=self.valid_image
        )
        payload = {"country": "Kenya", "city": "Nairobi"}
        response = self.client.post(self.intern_create_url, payload, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data["success"])

    def test_role_mismatch_blocks_company_from_creating_intern_profile(self):
        """Verifies your serializer role checks block alternative roles from signing up elsewhere."""
        self.client.force_authenticate(user=self.company_user)
        payload = {"country": "Rwanda", "city": "Kigali"}
        response = self.client.post(self.intern_create_url, payload, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    #  FILE VALIDATION CHECKPOINT TESTS 

    def test_file_validation_blocks_invalid_extension(self):
        """Ensures validators.py blocks unsafe file variants."""
        self.client.force_authenticate(user=self.intern_user)
        payload = {
            "country": "Rwanda", "city": "Gisenyi", "date_of_birth": "2002-10-15", "gender": "female",
            "current_status": "freelancer", "skills": "Design",
            "national_or_student_id_document": self.invalid_file_ext, # Malicious executable
            "profile_picture": self.valid_image,
        }
        response = self.client.post(self.intern_create_url, payload, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("national_or_student_id_document", response.data["errors"])

    def test_file_validation_blocks_oversized_payload(self):
        """Ensures byte-size check rules intercept files exceeding boundary thresholds."""
        self.client.force_authenticate(user=self.intern_user)
        payload = {
            "country": "Rwanda", "city": "Musanze", "date_of_birth": "2002-10-15", "gender": "male",
            "current_status": "job_seeker", "skills": "QA",
            "national_or_student_id_document": self.oversized_file, # 6 Megabytes
            "profile_picture": self.valid_image,
        }
        response = self.client.post(self.intern_create_url, payload, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # COMPANY PROFILE & NESTED REPRESENTATIVE TESTS

    def test_company_can_create_profile_with_nested_representative(self):
        """Validates nested atomic creation rules for profiles and contact tables simultaneously."""
        self.client.force_authenticate(user=self.company_user)
        payload = {
            "company_name": "EduBridge Labs",
            "business_type": "startup",
            "industry": self.industry.id,
            "country": "Rwanda",
            "city": "Kigali",
            "description": "Fostering elite software engineers.",
            "registration_certificate": self.valid_pdf,
            "representative.job_title": "Lead Recruiter", # Flattened multi-part layout notation
            "representative.corporate_email": "recruitment@edubridge.africa",
        }
        response = self.client.post(self.company_create_url, payload, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["success"])
        
        # Verify both database items exist and link cleanly in PostgreSQL
        company = CompanyProfile.objects.get(company_name="EduBridge Labs")
        self.assertEqual(company.representative.job_title, "Lead Recruiter")

    def test_company_can_update_profile_and_nested_representative(self):
        """Validates that serializer update routines handle nested table edits cleanly inside single PUT payloads."""
        self.client.force_authenticate(user=self.company_user)
        company = CompanyProfile.objects.create(
            user=self.company_user, company_name="EduBridge Labs HQ", business_type="sme",
            industry=self.industry, country="Rwanda", city="Kigali", description="Desc",
            registration_certificate=self.valid_pdf
        )
        CompanyRepresentative.objects.create(
            company=company, job_title="Manager", corporate_email="old@email.com"
        )

        # JSON payload for nested updates
        payload = {
            "city": "Rubavu",
            "representative": {
                "job_title": "Managing Director",
                "corporate_email": "new@email.com"
            }
        }
        response = self.client.put(self.company_me_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Refresh database instance state references
        company.refresh_from_db()
        self.assertEqual(company.city, "Rubavu")
        self.assertEqual(company.representative.corporate_email, "new@email.com")
