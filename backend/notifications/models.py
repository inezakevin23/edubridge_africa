from django.conf import settings
from django.db import models
from common.models import BaseModel 

class Notification(BaseModel): 
    class NotificationType(models.TextChoices):
        CHALLENGE_INVITATION = "challenge_invitation", "Challenge Invitation"
        SUBMISSION_REVIEWED = "submission_reviewed", "Submission Reviewed"
        CHALLENGE_SHORTLIST = "shortlisted", "Shortlisted" 
        NEW_SUBMISSION = "new_submission", "New Submission"

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(
        max_length=50,
        choices=NotificationType.choices,
    )
    is_read = models.BooleanField(default=False)

    related_object_id = models.UUIDField(
        null=True, 
        blank=True,
        help_text="The unique UUID string identifier of the originating object (Invite, Submission, etc.)."
    )

    class Meta:
        ordering = ["-created_at"] 

    def __str__(self):
        return f"{self.recipient.email} - {self.title}"
