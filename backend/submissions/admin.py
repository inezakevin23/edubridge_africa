from django.contrib import admin
from .models import Submission


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "challenge",
        "intern",
        "team",                
        "status",
        "company_score",
        "shortlisted",         
        "created_at",         
    )

    list_filter = (
        "status",
        "shortlisted",        
        "challenge__industry",
    )

    search_fields = (
        "title",
        "challenge__title",
        "intern__first_name", 
        "intern__last_name",
        "intern__email",
    )
    
    readonly_fields = ("created_at", "updated_at")
