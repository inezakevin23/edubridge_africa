from rest_framework import serializers

from .models import (
    Challenge,
    ChallengeRequirement,
    ChallengeTeam,
    TeamMember,
    ChallengeInvite,
)

from profiles.models import CompanyProfile
from profiles.serializers import CompanyProfileSerializer

class ChallengeRequirementSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChallengeRequirement
        fields = (
            "id",
            "description",
            "order",
        )

class ChallengeListSerializer(serializers.ModelSerializer):

    company = serializers.CharField(
        source="company.organization_name",
        read_only=True,
    )

    industry = serializers.CharField(
        source="industry.name",
        read_only=True,
    )

    class Meta:
        model = Challenge

        fields = (
            "id",
            "title",
            "company",
            "industry",
            "cash_prize",
            "deadline",
            "status",
        )

class ChallengeDetailSerializer(serializers.ModelSerializer):

    company = CompanyProfileSerializer(
        read_only=True,
    )

    industry = serializers.CharField(
        source="industry.name",
        read_only=True,
    )

    requirements = ChallengeRequirementSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Challenge

        fields = "__all__"

class ChallengeCreateUpdateSerializer(serializers.ModelSerializer):

    requirements = ChallengeRequirementSerializer(
        many=True,
        write_only=True,
    )

    class Meta:
        model = Challenge

        exclude = (
            "company",
            "created_at",
            "updated_at",
        )

    def create(self, validated_data):
        requirements = validated_data.pop(
            "requirements"
        )

        challenge = Challenge.objects.create(
            company=self.context["request"]
            .user
            .company_profile,
            **validated_data,
        )

        ChallengeRequirement.objects.bulk_create(
            [
                ChallengeRequirement(
                    challenge=challenge,
                    **requirement,
                )
                for requirement in requirements
            ]
        )

        return challenge

    def update(self, instance, validated_data):
        requirements = validated_data.pop(
            "requirements",
            None,
        )

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if requirements is not None:
            instance.requirements.all().delete()
            ChallengeRequirement.objects.bulk_create(
                [
                    ChallengeRequirement(
                        challenge=instance,
                        **requirement,
                    )
                    for requirement in requirements
                ]
            )
        return instance