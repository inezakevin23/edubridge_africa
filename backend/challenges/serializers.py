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
from notifications.models import Notification

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

class TeamMemberSerializer(
    serializers.ModelSerializer
):

    user_id = serializers.IntegerField(
        source="user.id",
        read_only=True,
    )

    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    full_name = serializers.SerializerMethodField()

    class Meta:

        model = TeamMember

        fields = (
            "id",
            "user_id",
            "username",
            "full_name",
            "joined_at",
        )

        read_only_fields = (
            "id",
            "user_id",
            "username",
            "full_name",
            "joined_at",
        )

    def get_full_name(self, obj):

        return obj.user.get_full_name()

class ChallengeTeamSerializer(
    serializers.ModelSerializer
):

    leader_name = serializers.SerializerMethodField()

    members = TeamMemberSerializer(
        many=True,
        read_only=True,
    )

    class Meta:

        model = ChallengeTeam

        fields = (
            "id",
            "challenge",
            "leader",
            "leader_name",
            "members",
            "created_at",
        )

        read_only_fields = (
            "id",
            "leader",
            "leader_name",
            "members",
            "created_at",
        )

    def get_leader_name(self, obj):

        return obj.leader.get_full_name()

class ChallengeInviteSerializer(serializers.ModelSerializer):

    sender_name = serializers.SerializerMethodField()
    receiver_name = serializers.SerializerMethodField()
    challenge_title = serializers.CharField(
        source="team.challenge.title",
        read_only=True,
    )

    class Meta:
        model = ChallengeInvite
        fields = (
            "id",
            "team",
            "challenge_title",
            "sender",
            "sender_name",
            "receiver",
            "receiver_name",
            "status",
            "created_at",
        )
        read_only_fields = (
            "id",
            "sender",
            "sender_name",
            "receiver_name",
            "status",
            "created_at",
        )

    def get_sender_name(self, obj):
        return obj.sender.get_full_name()

    def get_receiver_name(self, obj):
        return obj.receiver.get_full_name()

    def validate(self, attrs):
        request = self.context["request"]
        team = attrs["team"]
        receiver = attrs["receiver"]

        if team.leader != request.user:
            raise serializers.ValidationError(
                {
                    "team":
                    "Only the team leader can invite collaborators."
                }
            )

        if receiver == request.user:
            raise serializers.ValidationError(
                {
                    "receiver":
                    "You cannot invite yourself."
                }
            )

        if receiver.role != "intern":
            raise serializers.ValidationError(
                {
                    "receiver":
                    "Only intern users can be invited."
                }
            )

        if TeamMember.objects.filter(
            team=team,
            user=receiver,
        ).exists():
            raise serializers.ValidationError(
                {
                    "receiver":
                    "This user is already a member of the team."
                }
            )
        return attrs

    def create(self, validated_data):
        request = self.context["request"]
        team = validated_data["team"]
        receiver = validated_data["receiver"]
        invite = ChallengeInvite.objects.create(
            team=team,
            sender=request.user,
            receiver=receiver,
        )

        Notification.objects.create(
            recipient=receiver,
            title="Challenge Invitation",
            message=(
                f"{request.user.get_full_name()} "
                f"invited you to collaborate on "
                f"the challenge "
                f"'{team.challenge.title}'."
            ),
            notification_type=(
                Notification.NotificationType
                .CHALLENGE_INVITATION
            ),
            related_object_id=invite.id,
        )
        return invite