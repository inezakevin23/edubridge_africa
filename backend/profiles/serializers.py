from rest_framework import serializers

from .models import (
    Industry,
    InternProfile,
    CompanyProfile,
    CompanyRepresentative,
)

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

class CompanyRepresentativeSerializer(serializers.ModelSerializer):

    class Meta:

        model = CompanyRepresentative
        exclude = (
            "company",
        )

class CompanyProfileSerializer(serializers.ModelSerializer):

    industry = IndustrySerializer(read_only=True)
    representative = CompanyRepresentativeSerializer(read_only=True,)
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

        if hasattr(user, "company_profile"):

            raise serializers.ValidationError(
                "Company profile already exists."
            )

        industry = attrs.get("industry")
        new_industry = attrs.get("new_industry")

        if not industry and not new_industry:

            raise serializers.ValidationError(
                {
                    "industry":
                    "Select an industry or provide a new one."
                }
            )

        return attrs

    def create(self, validated_data):

        representative_data = validated_data.pop(
            "representative"
        )
        industry = validated_data.pop(
            "industry",
            None,
        )
        new_industry = validated_data.pop(
            "new_industry",
            "",
        )

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
    
    