from rest_framework import serializers
from django.db.models import Sum
from .models import (
    CompanyProfile,
    CompanyRepresentative,
    Industry,
    InternProfile,
)
from .validators import validate_file_size, validate_image, validate_pdf


class IndustrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Industry
        fields = [
            "id",
            "name",
        ]


class InternProfileSerializer(serializers.ModelSerializer):
    email = serializers.ReadOnlyField(source="user.email")
    username = serializers.ReadOnlyField(source="user.username")
    first_name = serializers.ReadOnlyField(source="user.first_name")
    last_name = serializers.ReadOnlyField(source="user.last_name")
    phone_number = serializers.ReadOnlyField(source="user.phone_number")
    total_score_points = serializers.SerializerMethodField()
    profile_picture = serializers.ImageField(required=False)
    national_or_student_id_document = serializers.FileField(required=False)

    class Meta:
        model = InternProfile
        fields = "__all__"
        read_only_fields = (
            "id",
            "user",
            "created_at",
            "updated_at",
            "verification_status",
        )

    def get_total_score_points(self, obj):
        user = obj.user
        if not user:
            return 0

        from submissions.models import Submission
        
        stats = Submission.objects.filter(
            intern=user, 
            company_score__isnull=False
        ).aggregate(total=Sum("company_score"))
        return stats["total"] if stats["total"] is not None else 0

class InternProfileCreateSerializer(serializers.ModelSerializer):
    national_or_student_id_document = serializers.FileField(required=True)
    profile_picture = serializers.ImageField(required=True)

    class Meta:
        model = InternProfile
        exclude = (
            "user",
            "verification_status",
        )

    def validate(self, attrs):
        user = self.context["request"].user

        from accounts.models import User
        if user.role != User.Roles.INTERN:
            raise serializers.ValidationError(
                {"detail": "Only accounts registered as Interns can create an intern profile."}
            )

        if hasattr(user, "intern_profile"):
            raise serializers.ValidationError(
                {"detail": "An intern profile already exists for this user account."}
            )

        id_doc = attrs.get("national_or_student_id_document")
        prof_pic = attrs.get("profile_picture")

        if id_doc:
            try:
                validate_pdf(id_doc)
                validate_file_size(id_doc)
            except serializers.ValidationError as e:
                raise serializers.ValidationError({"national_or_student_id_document": e.detail})

        if prof_pic:
            try:
                validate_image(prof_pic)
                validate_file_size(prof_pic)
            except serializers.ValidationError as e:
                raise serializers.ValidationError({"profile_picture": e.detail})
        return attrs

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return InternProfile.objects.create(**validated_data)



class CompanyRepresentativeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyRepresentative
        exclude = ("company",)


class CompanyProfileSerializer(serializers.ModelSerializer):
    industry = IndustrySerializer(read_only=True)
    representative = CompanyRepresentativeSerializer() 
    email = serializers.ReadOnlyField(source="user.email")
    username = serializers.ReadOnlyField(source="user.username")
    phone_number = serializers.ReadOnlyField(source="user.phone_number")

    class Meta:
        model = CompanyProfile
        fields = "__all__"
        read_only_fields = (
            "id",
            "user",
            "created_at",
            "updated_at",
            "verification_status",
        )

    def update(self, instance, validated_data):
        representative_data = validated_data.pop("representative", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if representative_data:
            representative_instance = getattr(instance, "representative", None)
            if representative_instance:
                for attr, value in representative_data.items():
                    setattr(representative_instance, attr, value)
                representative_instance.save()
            else:
                CompanyRepresentative.objects.create(company=instance, **representative_data)

        return instance


class CompanyProfileCreateSerializer(serializers.ModelSerializer):
    representative = CompanyRepresentativeSerializer()
    industry = serializers.PrimaryKeyRelatedField(
        queryset=Industry.objects.all(),
        required=False,
        allow_null=True,
    )

    new_industry = serializers.CharField(
        required=False,
        allow_blank=True,
        write_only=True,
    )

    class Meta:
        model = CompanyProfile
        exclude = (
            "user",
            "verification_status",
        )

    def validate(self, attrs):
        user = self.context["request"].user

        from accounts.models import User
        if user.role != User.Roles.COMPANY:
            raise serializers.ValidationError(
                {"detail": "Only accounts registered as Companies can create a company profile."}
            )

        if hasattr(user, "company_profile"):
            raise serializers.ValidationError(
                {"detail": "Company profile already exists."}
            )

        industry = attrs.get("industry")
        new_industry = attrs.get("new_industry")

        if not industry and not new_industry:
            raise serializers.ValidationError(
                {"industry": "Select an industry or provide a new one."}
            )

        return attrs

    def create(self, validated_data):
        representative_data = validated_data.pop("representative")
        industry = validated_data.pop("industry", None)
        new_industry = validated_data.pop("new_industry", "")

        if new_industry:
            industry, _ = Industry.objects.get_or_create(
                name=new_industry.strip()
            )

        company = CompanyProfile.objects.create(
            user=self.context["request"].user,
            industry=industry,
            **validated_data,
        )

        CompanyRepresentative.objects.create(
            company=company,
            **representative_data,
        )

        return company
