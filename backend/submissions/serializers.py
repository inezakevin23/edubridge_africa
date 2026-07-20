from rest_framework import serializers
from .models import Submission
from challenges.models import Challenge, ChallengeTeam
from accounts.models import User
from django.utils import timezone

class SubmissionSerializer(serializers.ModelSerializer):
    challenge_title = serializers.CharField(source="challenge.title", read_only=True)
    challenge_company_name = serializers.CharField(source="challenge.company.company_name", read_only=True, default=None)
    intern_name = serializers.SerializerMethodField()
    team_name = serializers.CharField(source="team.leader.get_full_name", read_only=True, allow_null=True)

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
            "shortlisted",
            "cash_prize_awarded",
            "created_at",
            "updated_at",
        )

    def get_intern_name(self, obj):
        return obj.intern.get_full_name() if obj.intern else None


class CreateSubmissionSerializer(serializers.ModelSerializer):
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

        team_instance = ChallengeTeam.objects.filter(challenge=challenge, members__user=user).first()
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
