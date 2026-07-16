from rest_framework import serializers
from .models import Submission
from challenges.models import Challenge
from profiles.models import InternProfile


class SubmissionSerializer(serializers.ModelSerializer):

    challenge_title = serializers.CharField(
        source="challenge.title",
        read_only=True,
    )

    intern_name = serializers.SerializerMethodField()


    class Meta:
        model = Submission

        fields = "__all__"

        read_only_fields = (
            "id",
            "intern",
            "submitted_at",
            "status",
            "company_score",
            "cash_awarded",
            "is_shortlisted",
            "reviewed_at",
        )

    def get_intern_name(self, obj):
        intern_profile = obj.intern

        if intern_profile:

            user = intern_profile.user

            if user:

                return f"{user.first_name} {user.last_name}"

        return None

class CreateSubmissionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Submission

        exclude = (
            "id",
            "intern",
            "submitted_at",
            "status",
            "company_score",
            "cash_awarded",
            "is_shortlisted",
            "reviewed_at",
        )

    def validate(self, attrs):

        request = self.context["request"]

        talent = request.user.talent_profile

        challenge = attrs["challenge"]

        if challenge.status != Challenge.Status.OPEN:
            raise serializers.ValidationError(
                "Challenge is closed."
            )

        if Submission.objects.filter(
            challenge=challenge,
            intern=intern,
        ).exists():

            raise serializers.ValidationError(
                "You have already submitted."
            )

        return attrs

    def create(self, validated_data):

        validated_data["intern"] = (
            self.context["request"]
            .user
            .intern_profile
        )

        return Submission.objects.create(
            **validated_data
        )

class ReviewSerializer(serializers.ModelSerializer):

    class Meta:

        model = Submission

        fields = (
            "company_score",
            "feedback",
            "cash_awarded",
            "is_shortlisted",
            "status",
        )

    def validate_company_score(self, value):

        if value < 0 or value > 100:
            raise serializers.ValidationError(
                "Score must be between 0 and 100."
            )

        return value

    def validate(self, attrs):

        submission = self.instance

        challenge = submission.challenge

        cash = attrs.get("cash_awarded")

        if (
            cash
            and challenge.cash_prize
            and cash > challenge.cash_prize
        ):

            raise serializers.ValidationError(
                {
                    "cash_awarded":
                    "Cannot exceed challenge cash prize."
                }
            )

        return attrs

