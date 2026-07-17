from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import User


class AccountModuleTests(APITestCase):

    def setUp(self):
        self.register_url = reverse("register")
        self.login_url = reverse("login")
        self.me_url = reverse("me")

        # Seed Baseline User for Login Testing Loops
        self.existing_email = "testuser@edubridge.africa"
        self.existing_password = "SecurePassword123!"
        self.user = User.objects.create_user(
            email=self.existing_email,
            username="base_hacker",
            first_name="Kevin",
            last_name="Rwanda",
            role=User.Roles.INTERN,
            password=self.existing_password,
        )

    # REGISTRATION WORKFLOW CHECKS 

    def test_user_can_register_with_valid_payload(self):
        """Verifies candidate account creation, field validation, and immediate token issuance loops."""
        payload = {
            "email": "newuser@edubridge.africa",
            "username": "fresh_talent",
            "first_name": "Alex",
            "last_name": "Munyaneza",
            "phone_number": "+250788000000",
            "role": "intern",
            "password": "PasswordRegister123!",
            "confirm_password": "PasswordRegister123!"
        }
        response = self.client.post(self.register_url, payload, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["success"])
        
        # Verify custom response architecture nests data profiles and authorization keys together
        self.assertIn("user", response.data["data"])
        self.assertIn("tokens", response.data["data"])
        self.assertEqual(response.data["data"]["user"]["email"], "newuser@edubridge.africa")

    def test_registration_fails_if_passwords_do_not_match(self):
        """Validates that serializer check conditions catch typos during onboarding."""
        payload = {
            "email": "typo@edubridge.africa",
            "username": "typo_user",
            "first_name": "Jane",
            "last_name": "Doe",
            "role": "intern",
            "password": "Password123!",
            "confirm_password": "DifferentPassword123!"
        }
        response = self.client.post(self.register_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data["success"])

    def test_registration_enforces_email_uniqueness(self):
        """Validates database constraints intercept duplicate registration rows."""
        payload = {
            "email": self.existing_email, # Already seeded in setUp
            "username": "distinct_username",
            "first_name": "Duplicate",
            "last_name": "User",
            "role": "company",
            "password": "Password123!",
            "confirm_password": "Password123!"
        }
        response = self.client.post(self.register_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    #  SECURE CREDENTIAL EXCHANGE CHECKS 

    def test_user_can_login_and_retrieve_enriched_jwt_claims(self):
        """Verifies SimpleJWT signs emails correctly and attaches profile properties to access payloads."""
        payload = {
            "email": self.existing_email,
            "password": self.existing_password
        }
        response = self.client.post(self.login_url, payload, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["success"])
        self.assertIn("access", response.data["data"]["tokens"])
        self.assertIn("refresh", response.data["data"]["tokens"])
        self.assertEqual(response.data["data"]["user"]["email"], self.existing_email)

    def test_login_fails_with_invalid_credentials(self):
        """Verifies bad password queries drop execution flow paths cleanly."""
        payload = {
            "email": self.existing_email,
            "password": "WrongPasswordX!"
        }
        response = self.client.post(self.login_url, payload, format="json")
        # Caught by your custom exception handler wrapper automatically
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse(response.data["success"])

    #  IDENTITY PROFILE TUNNEL CHECKS 

    def test_secure_profile_endpoint_requires_token(self):
        """Guards that access locks block unauthenticated requests."""
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_user_can_retrieve_own_profile(self):
        """Ensures Bearer tokens map incoming requests straight to the correct user account."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.me_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["data"]["email"], self.existing_email)
