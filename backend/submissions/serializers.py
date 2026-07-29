from rest_framework import serializers
from .models import Submission, SubmissionShortlist
from challenges.models import Challenge, ChallengeTeam
from accounts.models import User
from django.utils import timezone

class SubmissionSerializer(serializers.ModelSerializer):
    challenge_title = serializers.CharField(source="challenge.title", read_only=True)
    challenge_company_name = serializers.CharField(source="challenge.company.company_name", read_only=True, default=None)
    intern_name = serializers.SerializerMethodField()
    submitter = serializers.SerializerMethodField()
    submitter_profile_picture = serializers.SerializerMethodField()
    team_name = serializers.CharField(source="team.leader.get_full_name", read_only=True, allow_null=True)
    team_leader_picture = serializers.SerializerMethodField()
    team_members = serializers.SerializerMethodField()
    shortlisted_members = serializers.SerializerMethodField()

    class Meta:
        model = Submission
        fields = "__all__"
        read_only_fields = (
            "id",
            "intern",
            "team",
            "status",
            "company_score",
            "feedback",
            "cash_prize_awarded",
            "created_at",
            "updated_at",
        )

    def get_intern_name(self, obj):
        return obj.intern.get_full_name() if obj.intern else None

    def get_absolute_url(self, file_field):
        """Convert a relative file URL to an absolute URL using the request context."""
        if not file_field:
            return None
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(file_field.url)
        return file_field.url

    def get_submitter(self, obj):
        """Return the submitter user object with profile picture and details."""
        if not obj.intern:
            return None
        profile = getattr(obj.intern, "intern_profile", None)
        return {
            "id": str(obj.intern.id),
            "first_name": obj.intern.first_name,
            "last_name": obj.intern.last_name,
            "email": obj.intern.email,
            "username": obj.intern.username,
            "profile_picture": self.get_absolute_url(profile.profile_picture) if profile and profile.profile_picture else None,
            "institution": profile.institution if profile else "",
            "organization": profile.institution if profile else "",
        }

    def get_submitter_profile_picture(self, obj):
        """Return the submitter's profile picture URL directly."""
        if not obj.intern:
            return None
        profile = getattr(obj.intern, "intern_profile", None)
        return self.get_absolute_url(profile.profile_picture) if profile and profile.profile_picture else None

    def get_team_leader_picture(self, obj):
        """Return the team leader's profile picture if this is a team submission."""
        if not obj.team or not obj.team.leader:
            return None
        profile = getattr(obj.team.leader, "intern_profile", None)
        return self.get_absolute_url(profile.profile_picture) if profile and profile.profile_picture else None

    def get_team_members(self, obj):
        """Return list of team members for this submission if it's a team submission."""
        if not obj.team:
            return []
        members = []
        for tm in obj.team.members.select_related("user").all():
            profile = getattr(tm.user, "intern_profile", None)
            members.append({
                "id": str(tm.user.id),
                "first_name": tm.user.first_name,
                "last_name": tm.user.last_name,
                "email": tm.user.email,
                "role": tm.role,
                "profile_picture": self.get_absolute_url(profile.profile_picture) if profile and profile.profile_picture else None,
            })
        return members

    def get_shortlisted_members(self, obj):
        """Return list of shortlisted users with details for this submission."""
        shortlisted = []
        for entry in obj.shortlist_entries.select_related("user").all():
            user = entry.user
            profile = getattr(user, "intern_profile", None)
            shortlisted.append({
                "id": str(user.id),
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "username": user.username,
                "role": user.role,
                "profile_picture": self.get_absolute_url(profile.profile_picture) if profile and profile.profile_picture else None,
                "institution": profile.institution if profile else "",
                "organization": profile.institution if profile else "",
            })
        return shortlisted


class CreateSubmissionSerializer(serializers.ModelSerializer):
    submission_fields = {
        "Written Report": ("report_file", "report_link"),
        "Design File": ("other_file", "design_link"),
        "Code Repository": ("github_repository",),
        "Slide Deck": ("slides_file", "slides_link"),
        "Video Walkthrough": ("video_link",),
        "Spreadsheet": ("spreadsheet_file", "spreadsheet_link"),
    }

    report_link = serializers.CharField(required=False, allow_blank=True)
    design_link = serializers.CharField(required=False, allow_blank=True)
    github_repository = serializers.CharField(required=False, allow_blank=True)
    slides_link = serializers.CharField(required=False, allow_blank=True)
    video_link = serializers.CharField(required=False, allow_blank=True)
    spreadsheet_link = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Submission
        exclude = (
            "intern",
            "status",
            "company_score",
            "feedback",
            "shortlisted",
            "cash_prize_awarded",
        )

    def validate(self, attrs):
        request = self.context["request"]
        user = request.user
        challenge = attrs["challenge"]

        if user.role != User.Roles.INTERN:
            raise serializers.ValidationError({"detail": "Only accounts registered as Interns can submit solutions."})

        if challenge.status != "published":
            raise serializers.ValidationError({"challenge": "This challenge is currently not accepting submissions."})

        if timezone.now() > challenge.submission_deadline:
            raise serializers.ValidationError(
                {"detail": f"Submission rejected. The deadline for this challenge passed on {challenge.submission_deadline.strftime('%B %d, %Y at %I:%M %p')}"}
            )

        accepted_formats = challenge.submission_formats or []
        if accepted_formats:
            accepted_fields = {
                field
                for format_name in accepted_formats
                for field in self.submission_fields.get(format_name, ())
            }
            submitted_fields = {
                field
                for fields in self.submission_fields.values()
                for field in fields
                if attrs.get(field)
            }
            unsupported_fields = submitted_fields - accepted_fields
            if unsupported_fields:
                raise serializers.ValidationError(
                    {
                        "detail": "Your submission includes a format that this company does not accept."
                    }
                )
            if not submitted_fields:
                raise serializers.ValidationError(
                    {
                        "detail": "Add a deliverable in one of the accepted submission formats."
                    }
                )

        team_instance = ChallengeTeam.objects.filter(challenge=challenge, members__user=user).first()
        if team_instance and team_instance.leader != user:
            if not Submission.objects.filter(
                challenge=challenge, team=team_instance
            ).exists():
                raise serializers.ValidationError(
                    {
                        "detail": "Only the team leader can submit a solution while your team submission is pending."
                    }
                )
            # Once the team submission exists, members may submit an independent solution.
            team_instance = None

        attrs["team"] = team_instance

        if team_instance:
            if Submission.objects.filter(challenge=challenge, team=team_instance).exists():
                raise serializers.ValidationError({"detail": "Your team has already submitted a project solution."})
        else:
            if Submission.objects.filter(challenge=challenge, intern=user).exists():
                raise serializers.ValidationError({"detail": "You have already submitted a standalone project solution."})

        return attrs

    def create(self, validated_data):
        validated_data["intern"] = self.context["request"].user
        return Submission.objects.create(**validated_data)


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = (
            "company_score",
            "feedback",
            "cash_prize_awarded",  
            "shortlisted",        
            "status",
        )

    def validate_company_score(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError("Score must remain inside a 0-100 scoring tier.")
        return value

    def validate(self, attrs):
        submission = self.instance
        challenge = submission.challenge
        cash = attrs.get("cash_prize_awarded")

        if cash and challenge.cash_prize and cash > challenge.cash_prize:
            raise serializers.ValidationError(
                {"cash_prize_awarded": f"The cash reward amount cannot exceed the challenge grand prize pool of ${challenge.cash_prize}."}
            )
            
        if "status" not in attrs and attrs.get("company_score") is not None:
            attrs["status"] = Submission.Status.REVIEWED

        return attrs


class ShortlistToggleSerializer(serializers.Serializer):
    """Toggle shortlist status for a specific user on a submission."""
    user_id = serializers.UUIDField()
    shortlisted = serializers.BooleanField()

    def validate_user_id(self, value):
        try:
            user = User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found.")
        return user

    def validate(self, attrs):
        submission = self.context["submission"]
        user = attrs["user_id"]

        # Verify the user is either the intern or a team member
        if submission.team:
            is_member = submission.team.members.filter(user=user).exists()
            if not is_member and submission.intern != user:
                raise serializers.ValidationError(
                    {"user_id": "This user is not part of this submission."}
                )
        elif submission.intern != user:
            raise serializers.ValidationError(
                {"user_id": "This user is not associated with this submission."}
            )
        return attrs
