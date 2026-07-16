from django.contrib import admin

from .models import (
    Challenge,
    ChallengeInvite,
    ChallengeRequirement,
    ChallengeTeam,
    TeamMember,
)


class ChallengeRequirementInline(admin.TabularInline):
    model = ChallengeRequirement
    extra = 1


@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "company",
        "industry",
        "status",
        "submission_deadline", 
        "created_at",
    )

    list_filter = (
        "status",
        "industry",
        "created_at",
    )

    search_fields = (
        "title",
        "description",
        "company__company_name",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    inlines = [ChallengeRequirementInline]


@admin.register(ChallengeTeam)
class ChallengeTeamAdmin(admin.ModelAdmin):
    list_display = (
        "challenge",
        "leader",
        "created_at",
    )

    search_fields = (
        "challenge__title",
        "leader__email",
    )


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = (
        "team",
        "user",
        "joined_at",
    )


@admin.register(ChallengeInvite)
class ChallengeInviteAdmin(admin.ModelAdmin):
    list_display = (
        "team",
        "sender",
        "receiver",
        "status",
        "created_at",
    )

    list_filter = ("status",)


@admin.register(ChallengeRequirement)
class ChallengeRequirementAdmin(admin.ModelAdmin):
    list_display = (
        "challenge",
        "order",
    )
