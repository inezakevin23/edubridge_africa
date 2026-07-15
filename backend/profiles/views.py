from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import Http404

from accounts.permissions import (
    IsIntern,
    IsCompany,
)

from .models import (
    Industry,
    InternProfile,
    CompanyProfile,
)

from .serializers import (
    IndustrySerializer,
    InternProfileSerializer,
    CompanyProfileSerializer,
    CompanyProfileCreateSerializer,
)

class IndustryListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        industries = Industry.objects.all()

        serializer = IndustrySerializer(
            industries,
            many=True,
        )

        return Response(
            {
                "success": True,
                "message": "Industries retrieved successfully.",
                "data": serializer.data,
            }
        )

class InternProfileCreateView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsIntern,
    ]

    def post(self, request):

        serializer = InternProfileSerializer(
            data=request.data,
            context={"request": request},
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save(
            user=request.user
        )

        return Response(
            {
                "success": True,
                "message":
                "Intern profile created successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )

class InternProfileView(APIView):
    permission_classes = [
        IsAuthenticated,
        IsIntern,
    ]

    def get_object(self, user):
        try:
            return user.intern_profile
        except InternProfile.DoesNotExist:
            raise Http404("Intern profile not found.")

    def get(self, request):
        profile = self.get_object(request.user)

        serializer = InternProfileSerializer(profile)

        return Response(
            {
                "success": True,
                "message": "Intern profile retrieved successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
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
        serializer.save()

        return Response(
            {
                "success": True,
                "message": "Intern profile updated successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

class CompanyProfileCreateView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsCompany,
    ]

    def post(self, request):

        serializer = CompanyProfileCreateSerializer(
            data=request.data,
            context={"request": request},
        )

        serializer.is_valid(
            raise_exception=True
        )

        company = serializer.save()

        return Response(
            {
                "success": True,
                "message":
                "Company profile created successfully.",
                "data":
                CompanyProfileSerializer(
                    company
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )

class CompanyProfileView(APIView):
    permission_classes = [
        IsAuthenticated,
        IsCompany,
    ]

    def get_object(self, user):
        try:
            return user.company_profile
        except CompanyProfile.DoesNotExist:
            raise Http404("Company profile not found.")

    def get(self, request):
        profile = self.get_object(request.user)

        serializer = CompanyProfileSerializer(profile)

        return Response(
            {
                "success": True,
                "message": "Company profile retrieved successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
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
        serializer.save()

        return Response(
            {
                "success": True,
                "message": "Company profile updated successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

