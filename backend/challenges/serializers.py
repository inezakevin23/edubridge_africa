from rest_framework import serializers

from accounts.models import User
from notifications.models import Notification
from profiles.serializers import CompanyProfileSerializer

from .models import (
    Challenge,
    ChallengeInvite,
    ChallengeRequirement,
    ChallengeTeam,
    TeamMember,
)


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
        source="company.company_name",
        read_only=True,
    )
    industry = serializers.CharField(
        source="industry.name",
        read_only=True,
    )
    submissions_count = serializers.IntegerField(read_only=True, default=0)
    company_is_verified = serializers.SerializerMethodField()

    def get_company_is_verified(self, obj):
        return (
            obj.company.user.is_verified
            or obj.company.verification_status == "verified"
        )

    class Meta:
        model = Challenge
        fields = (
            "id",
            "title",
            "company",
            "industry",
            "cash_prize",
            "submission_deadline",
            "status",
            "submissions_count",
            "company_is_verified",
        )


class ChallengeDetailSerializer(serializers.ModelSerializer):
    company = CompanyProfileSerializer(read_only=True)
    industry = serializers.CharField(source="industry.name", read_only=True)
    requirements = ChallengeRequirementSerializer(many=True, read_only=True)

    class Meta:
        model = Challenge
        fields = "__all__"


class ChallengeCreateUpdateSerializer(serializers.ModelSerializer):
    requirements = ChallengeRequirementSerializer(many=True, write_only=True, required=False)
    category = serializers.CharField(write_only=True, required=False, help_text="Industry name (e.g. 'Technology', 'Finance')")
    submission_deadline = serializers.DateTimeField(required=False)

    class Meta:
        model = Challenge
        exclude = (
            "company",
            "created_at",
            "updated_at",
        )
        extra_kwargs = {
            "industry": {"required": False, "allow_null": True},
            "description": {"required": False},
            "skills": {"required": False},
            "title": {"required": False},
        }

    def to_internal_value(self, data):
        # Allow submission_deadline to accept date-only strings by appending time
        deadline = data.get("submission_deadline")
        if deadline and isinstance(deadline, str) and "T" not in deadline:
            data = data.copy() if hasattr(data, "copy") else {**data}
            data["submission_deadline"] = f"{deadline}T23:59:59Z"
        return super().to_internal_value(data)

    def validate_submission_formats(self, value):
        supported_formats = {
            "Written Report",
            "Design File",
            "Code Repository",
            "Slide Deck",
            "Video Walkthrough",
            "Spreadsheet",
        }

        if not value:
            raise serializers.ValidationError(
                "Select at least one accepted submission format."
            )
        if not isinstance(value, list) or any(
            item not in supported_formats for item in value
        ):
            raise serializers.ValidationError("One or more submission formats are invalid.")
        return value

    def create(self, validated_data):
        from profiles.models import Industry
        requirements = validated_data.pop("requirements", [])
        company = validated_data.pop("company")
        category = validated_data.pop("category", None)

        if category and "industry" not in validated_data:
            industry_obj, _ = Industry.objects.get_or_create(name=category)
            validated_data["industry"] = industry_obj

        challenge = Challenge.objects.create(
            company=company,
            **validated_data,
        )

        for requirement in requirements:
            ChallengeRequirement.objects.create(challenge=challenge, **requirement)
        return challenge

    def update(self, instance, validated_data):
        from profiles.models import Industry
        requirements = validated_data.pop("requirements", None)
        category = validated_data.pop("category", None)

        if category and "industry" not in validated_data:
            industry_obj, _ = Industry.objects.get_or_create(name=category)
            validated_data["industry"] = industry_obj

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if requirements is not None:
            instance.requirements.all().delete()
            for requirement in requirements:
                ChallengeRequirement.objects.create(challenge=instance, **requirement)
        return instance


class TeamMemberSerializer(serializers.ModelSerializer):
    user_id = serializers.UUIDField(
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
            "role",
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


class ChallengeTeamSerializer(serializers.ModelSerializer):
    leader_name = serializers.SerializerMethodField()
    members = TeamMemberSerializer(many=True, read_only=True)
    has_submission = serializers.SerializerMethodField()
    challenge = serializers.UUIDField()

    class Meta:
        model = ChallengeTeam
        fields = (
            "id",
            "challenge",
            "leader",
            "leader_name",
            "members",
            "has_submission",
            "created_at",
        )
        read_only_fields = (
            "id",
            "challenge",
            "leader",
            "leader_name",
            "members",
            "created_at",
        )

    def get_leader_name(self, obj):
        return obj.leader.get_full_name()

    def get_has_submission(self, obj):
        return obj.submissions.exists()


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
                {"team": "Only the team leader can invite collaborators."}
            )

        if receiver == request.user:
            raise serializers.ValidationError(
                {"receiver": "You cannot invite yourself."}
            )

        if receiver.role != User.Roles.INTERN:
            raise serializers.ValidationError(
                {"receiver": "Only intern users can be invited."}
            )

        if TeamMember.objects.filter(team=team, user=receiver).exists():
            raise serializers.ValidationError(
                {"receiver": "This user is already a member of the team."}
            )
        if team.members.count() >= team.challenge.max_team_size:
            raise serializers.ValidationError(
                {"team": "This team has reached the challenge's maximum team size."}
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
                f"the challenge '{team.challenge.title}'."
            ),
            notification_type=Notification.NotificationType.CHALLENGE_INVITATION,
            related_object_id=invite.id,
        )
        return invite
