from decimal import Decimal
from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from challenges.models import Challenge, ChallengeTeam  
from common.models import BaseModel 
from .validators import validate_document


class SubmissionShortlist(BaseModel):
    """Tracks which specific users are shortlisted within a team submission.
    
    A company may shortlist one or many team members from a group submission.
    """
    submission = models.ForeignKey(
        "Submission",
        on_delete=models.CASCADE,
        related_name="shortlist_entries",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="shortlisted_entries",
    )
    shortlisted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("submission", "user")
        ordering = ["-shortlisted_at"]

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.email} shortlisted for {self.submission.title}"


class Submission(BaseModel):
    class Status(models.TextChoices):
        SUBMITTED = "submitted", "Submitted"
        UNDER_REVIEW = "under_review", "Under Review"
        REVIEWED = "reviewed", "Reviewed"

    challenge = models.ForeignKey(
        Challenge,
        on_delete=models.CASCADE,
        related_name="submissions",
    )
    intern = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="submissions",
        help_text="The individual talent or team representative submitting the files."
    )
    
    team = models.ForeignKey(
        ChallengeTeam,
        on_delete=models.SET_NULL,
        related_name="submissions",
        blank=True,
        null=True,
        help_text="Leave blank if this is a solo submission."
    )

    title = models.CharField(max_length=200)
    summary = models.TextField()

    report_file = models.FileField(
        upload_to="submissions/reports/",
        validators=[validate_document],
        blank=True,
        null=True,
    )
    slides_file = models.FileField(
        upload_to="submissions/slides/",
        validators=[validate_document],
        blank=True,
        null=True,
    )
    spreadsheet_file = models.FileField(
        upload_to="submissions/spreadsheets/",
        validators=[validate_document],
        blank=True,
        null=True,
    )
    other_file = models.FileField(
        upload_to="submissions/other/",
        validators=[validate_document],
        blank=True,
        null=True,
    )

    report_link = models.URLField(blank=True)
    design_link = models.URLField(blank=True)
    github_repository = models.URLField(blank=True)
    slides_link = models.URLField(blank=True)
    video_link = models.URLField(blank=True)
    spreadsheet_link = models.URLField(blank=True)

    company_score = models.PositiveSmallIntegerField(
        blank=True,
        null=True,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(100),
        ],
    )
    feedback = models.TextField(blank=True)
    shortlisted = models.BooleanField(default=False)
    cash_prize_awarded = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.SUBMITTED,
    )

    class Meta:
        ordering = ["-created_at"] 
        unique_together = (
            ("challenge", "intern"),
            ("challenge", "team"),
        )

    def __str__(self):
        return f"{self.title} - {self.challenge.title}"
