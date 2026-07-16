from django.conf import settings
from django.db import models


class Notification(models.Model):

    class NotificationType(models.TextChoices):

        CHALLENGE_INVITATION = (
            "challenge_invitation",
            "Challenge Invitation",
        )

        SUBMISSION_REVIEWED = (
            "submission_reviewed",
            "Submission Reviewed",
        )

        SHORTLISTED = (
            "shortlisted",
            "Shortlisted",
        )

        NEW_SUBMISSION = (
            "new_submission",
            "New Submission",
        )

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )

    title = models.CharField(
        max_length=255
    )

    message = models.TextField()

    notification_type = models.CharField(
        max_length=50,
        choices=NotificationType.choices,
    )

    is_read = models.BooleanField(
        default=False
    )

    # Optional reference to the relevant object
    related_object_id = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):

        return (
            f"{self.recipient.email} - "
            f"{self.title}"
        )