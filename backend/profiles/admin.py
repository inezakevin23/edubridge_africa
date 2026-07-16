from django.contrib import admin
from .models import (
    CompanyProfile,
    CompanyRepresentative,
    Industry,
    InternProfile,
)


class CompanyRepresentativeInline(admin.StackedInline):
    """
    Embeds the representative profile directly inside the company details screen.
    """
    model = CompanyRepresentative
    can_delete = False 
    verbose_name = "Corporate Representative Contact"
    verbose_name_plural = "Corporate Representative Contacts"


@admin.register(InternProfile)
class InternProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "country",
        "current_status",
        "verification_status",
        "created_at",
    )
    list_filter = ("verification_status", "current_status", "country")
    search_fields = (
        "user__username", 
        "user__email", 
        "user__first_name", 
        "user__last_name"
    )
    readonly_fields = ("created_at", "updated_at")


@admin.register(CompanyProfile)
class CompanyProfileAdmin(admin.ModelAdmin):
    list_display = (
        "company_name",
        "business_type",
        "industry",
        "verification_status",
        "created_at",
    )
    list_filter = ("verification_status", "business_type", "country")
    search_fields = (
        "company_name", 
        "user__username", 
        "user__email"
    )
    readonly_fields = ("created_at", "updated_at")
    
    inlines = [CompanyRepresentativeInline]


@admin.register(CompanyRepresentative)
class CompanyRepresentativeAdmin(admin.ModelAdmin):
    """
    Retained fallback registry if admins need to query representatives standalone.
    """
    list_display = ("company", "job_title", "corporate_email", "created_at")
    search_fields = ("company__company_name", "corporate_email", "job_title")
    readonly_fields = ("created_at", "updated_at")


@admin.register(Industry)
class IndustryAdmin(admin.ModelAdmin):
    list_display = ("name", "created_at")
    search_fields = ("name",)
    readonly_fields = ("created_at",)
