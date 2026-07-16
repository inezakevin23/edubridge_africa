import uuid
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from .models import Notification


class NotificationModuleTests(APITestCase):

    def setUp(self):
        # 1. Setup Primary Target User
        self.recipient_user = User.objects.create_user(
            email="recipient@edubridge.africa",
            username="alert_user",
            first_name="Kevin",
            last_name="Doe",
            role=User.Roles.INTERN,
            password="SecurePassword123!",
        )

        # 2. Setup Alternative User (for security and data isolation tests)
        self.other_user = User.objects.create_user(
            email="otheruser@edubridge.africa",
            username="isolated_user",
            first_name="Jane",
            last_name="Smith",
            role=User.Roles.INTERN,
            password="SecurePassword123!",
        )

        # 3. Seed Base Test Notifications for the Target User
        self.notification_1 = Notification.objects.create(
            recipient=self.recipient_user,
            title="Team Challenge Invitation",
            message="You have been invited to join Team Alpha.",
            notification_type=Notification.NotificationType.CHALLENGE_INVITATION,
            related_object_id=uuid.uuid4(),
            is_read=False,
        )

        self.notification_2 = Notification.objects.create(
            recipient=self.recipient_user,
            title="Project Submission Reviewed",
            message="Your hackathon submission has been graded.",
            notification_type=Notification.NotificationType.SUBMISSION_REVIEWED,
            related_object_id=uuid.uuid4(),
            is_read=False,
        )

        # 4. Seed an Isolated Notification for the Other User
        self.other_notification = Notification.objects.create(
            recipient=self.other_user,
            title="Private Alert",
            message="This should never be visible to the main recipient.",
            notification_type=Notification.NotificationType.NEW_SUBMISSION,
            related_object_id=uuid.uuid4(),
            is_read=False,
        )

        # Core API Endpoints Path Registries
        self.list_url = reverse("notification-list")
        self.read_all_url = reverse("mark-all-notifications-read")

    #  DATA RETRIEVAL AND ISOLATION TESTS 

    def test_anonymous_user_cannot_list_notifications(self):
        """Verifies unauthenticated public clients are locked out of the alerts stream."""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_user_only_sees_their_own_notifications(self):
        """Ensures query filtering logic blocks accounts from cross-reading private alerts."""
        self.client.force_authenticate(user=self.recipient_user)
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["success"])
        
        # Should count exactly the 2 alerts seeded for recipient_user, omitting other_user's alert
        self.assertEqual(len(response.data["data"]["results"]), 2)

    #  STATE MODIFICATION AND ROUTING TESTS

    def test_user_can_mark_individual_notification_as_read(self):
        """Tests individual patch status modification operations using custom UUID routes."""
        read_url = reverse("mark-notification-read", kwargs={"pk": self.notification_1.id})
        
        self.client.force_authenticate(user=self.recipient_user)
        payload = {"is_read": True}
        response = self.client.patch(read_url, payload, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["success"])
        self.assertTrue(response.data["data"]["is_read"])
        
        # Verify persistence changes directly inside the PostgreSQL database layer
        self.notification_1.refresh_from_db()
        self.assertTrue(self.notification_1.is_read)

    def test_user_cannot_mark_another_users_notification_as_read(self):
        """Guards database records against cross-tenant state manipulation attempts."""
        # Attempt to access other_user's notification ID while logged in as recipient_user
        malicious_url = reverse("mark-notification-read", kwargs={"pk": self.other_notification.id})
        
        self.client.force_authenticate(user=self.recipient_user)
        payload = {"is_read": True}
        response = self.client.patch(malicious_url, payload, format="json")
        
        # View querysets use self.request.user filtering, returning a clean 404 instead of a 403 leakage hint
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # BULK MATRIX OPERATIONS TESTS

    def test_user_can_mark_all_notifications_as_read_simultaneously(self):
        """Validates database transaction batch optimization queries."""
        self.client.force_authenticate(user=self.recipient_user)
        response = self.client.post(self.read_all_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["data"]["updated_count"], 2)
        
        # Confirm that both records are marked read for the primary user
        self.notification_1.refresh_from_db()
        self.notification_2.refresh_from_db()
        self.assertTrue(self.notification_1.is_read)
        self.assertTrue(self.notification_2.is_read)
        
        # Confirm that the other user's alert remains untouched (is_read=False)
        self.other_notification.refresh_from_db()
        self.assertFalse(self.other_notification.is_read)
