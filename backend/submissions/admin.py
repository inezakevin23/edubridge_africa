from django.contrib import admin

from .models import Submission


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):

    list_display = (
        "challenge",
        "talent",
        "status",
        "company_score",
        "is_shortlisted",
        "submitted_at",
    )

    list_filter = (
        "status",
        "is_shortlisted",
    )

    search_fields = (
        "challenge__title",
        "talent__user__first_name",
        "talent__user__last_name",
    )