from django.http import Http404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from accounts.permissions import IsAdmin, IsCompany, IsIntern
from common.responses import api_response

from .models import CompanyProfile, Industry, InternProfile
from .serializers import (
    CompanyProfileCreateSerializer,
    CompanyProfileSerializer,
    IndustrySerializer,
    InternProfileCreateSerializer,
    InternProfileSerializer,
    PublicInternProfileSerializer,
)


class PublicInternProfileDetailView(APIView):
    """View for companies to see an intern's public profile by user ID."""
    permission_classes = [IsAuthenticated, IsCompany]

    def get_object(self, user_id):
        try:
            profile = InternProfile.objects.select_related("user").get(user__id=user_id)
            return profile
        except InternProfile.DoesNotExist:
            raise Http404("Intern profile not found.")

    def get(self, request, user_id):
        profile = self.get_object(user_id)
        serializer = PublicInternProfileSerializer(profile)
        return api_response(
            success=True,
            message="Intern profile retrieved successfully.",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )


class IndustryListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        industries = Industry.objects.all()
        serializer = IndustrySerializer(industries, many=True)
        return api_response(
            success=True,
            message="Industries retrieved successfully.",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )


class InternProfileCreateView(APIView):
    permission_classes = [IsAuthenticated, IsIntern]

    def post(self, request):
        serializer = InternProfileCreateSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        intern_profile = serializer.save()
        return api_response(
            success=True,
            message="Intern profile created successfully.",
            data=InternProfileSerializer(intern_profile).data,
            status_code=status.HTTP_201_CREATED,
        )


class InternProfileView(APIView):
    permission_classes = [IsAuthenticated, IsIntern]

    def get_object(self, user):
        try:
            return user.intern_profile
        except InternProfile.DoesNotExist:
            raise Http404("Intern profile not found.")

    def get(self, request):
        profile = self.get_object(request.user)
        serializer = InternProfileSerializer(profile)
        return api_response(
            success=True,
            message="Intern profile retrieved successfully.",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )

    def put(self, request):
        profile = self.get_object(request.user)
        serializer = InternProfileSerializer(
            profile,
            data=request.data,
            partial=True,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        updated_profile = serializer.save()

        return api_response(
            success=True,
            message="Intern profile updated successfully.",
            data=InternProfileSerializer(updated_profile).data,
            status_code=status.HTTP_200_OK,
        )


class CompanyProfileCreateView(APIView):
    permission_classes = [IsAuthenticated, IsCompany]

    def post(self, request):
        serializer = CompanyProfileCreateSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        company = serializer.save()
        return api_response(
            success=True,
            message="Company profile created successfully.",
            data=CompanyProfileSerializer(company).data,
            status_code=status.HTTP_201_CREATED,
        )


class CompanyProfileView(APIView):
    permission_classes = [IsAuthenticated, IsCompany]

    def get_object(self, user):
        try:
            return user.company_profile
        except CompanyProfile.DoesNotExist:
            raise Http404("Company profile not found.")

    def get(self, request):
        profile = self.get_object(request.user)
        serializer = CompanyProfileSerializer(profile)
        return api_response(
            success=True,
            message="Company profile retrieved successfully.",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )

    def put(self, request):
        profile = self.get_object(request.user)
        serializer = CompanyProfileSerializer(
            profile,
            data=request.data,
            partial=True,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        updated_company = serializer.save()

        return api_response(
            success=True,
            message="Company profile updated successfully.",
            data=CompanyProfileSerializer(updated_company).data,
            status_code=status.HTTP_200_OK,
        )
