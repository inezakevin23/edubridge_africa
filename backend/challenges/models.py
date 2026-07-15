from django.db import models
from django.conf import settings
from profiles.models import CompanyProfile, Industry


class Challenge(models.Model):

    STATUS_CHOICES = (
        ("draft", "Draft"),
        ("published", "Published"),
        ("closed", "Closed"),
    )

    title = models.CharField(max_length=200)

    description = models.TextField()

    company = models.ForeignKey(
        CompanyProfile,
        on_delete=models.CASCADE,
        related_name="challenges",
    )

    industry = models.ForeignKey(
        Industry,
        on_delete=models.PROTECT,
        related_name="challenges",
    )

    cash_prize = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
    )

    deadline = models.DateTimeField()

    max_team_size = models.PositiveIntegerField(
        default=1
    )

    skills = models.TextField(
        help_text="Comma separated skills"
    )

    submission_formats = models.JSONField(
        default=list
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="draft",
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title

class ChallengeRequirement(models.Model):

    challenge = models.ForeignKey(
        Challenge,
        on_delete=models.CASCADE,
        related_name="requirements",
    )

    description = models.TextField()

    order = models.PositiveIntegerField()

    class Meta:
        ordering = ["order"]

class ChallengeTeam(models.Model):

    challenge = models.ForeignKey(
        Challenge,
        on_delete=models.CASCADE,
        related_name="teams"
    )

    leader = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="led_teams"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.challenge.title} - {self.leader.email}"

class TeamMember(models.Model):

    team = models.ForeignKey(
        ChallengeTeam,
        on_delete=models.CASCADE,
        related_name="members"
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    joined_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        unique_together = ("team", "user")

class ChallengeInvite(models.Model):

    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("declined", "Declined"),
    )

    team = models.ForeignKey(
        ChallengeTeam,
        on_delete=models.CASCADE,
        related_name="invites"
    )

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sent_invites"
    )

    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="received_invites"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        unique_together = ("team", "receiver")