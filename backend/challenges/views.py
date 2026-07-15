from django.db.models import Q
from rest_framework import filters, status
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    UpdateAPIView,
    DestroyAPIView,
)
from rest_framework.permissions import (
    IsAuthenticated,
    AllowAny,
)
from rest_framework.response import Response
from .models import Challenge
from .permissions import (
    IsCompany,
    IsChallengeOwner,
)
from .serializers import (
    ChallengeListSerializer,
    ChallengeDetailSerializer,
    ChallengeCreateUpdateSerializer,
)
from common.responses import api_response
from common.pagination import StandardPagination
from rest_framework import filters


class ChallengeListView(ListAPIView):

    serializer_class = ChallengeListSerializer
    permission_classes = [AllowAny]
    pagination_class = StandardPagination

    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    search_fields = [
        "title",
        "description",
        "company__organization_name",
    ]

    ordering_fields = [
        "created_at",
        "submission_deadline",
        "title",
    ]

    def get_queryset(self):

        queryset = Challenge.objects.filter(
            status="published"
        )

        industry = self.request.query_params.get(
            "industry"
        )

        if industry:

            queryset = queryset.filter(
                industry_id=industry
            )

        return queryset

class ChallengeDetailView(RetrieveAPIView):

    queryset = Challenge.objects.filter(
        status="published"
    )

    serializer_class = ChallengeDetailSerializer

    permission_classes = [AllowAny]

class ChallengeCreateView(CreateAPIView):

    serializer_class = ChallengeCreateUpdateSerializer

    permission_classes = [
        IsAuthenticated,
        IsCompany,
    ]

    def create(
        self,
        request,
        *args,
        **kwargs,
    ):

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return api_response(
            success=True,
            message="Challenge created successfully.",
            data=serializer.data,
            status_code=status.HTTP_201_CREATED,
        )

class ChallengeUpdateView(UpdateAPIView):

    serializer_class = ChallengeCreateUpdateSerializer

    permission_classes = [
        IsAuthenticated,
        IsCompany,
        IsChallengeOwner,
    ]

    queryset = Challenge.objects.all()

    def update(
        self,
        request,
        *args,
        **kwargs,
    ):

        partial = kwargs.pop(
            "partial",
            False,
        )

        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial,
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return api_response(
            success=True,
            message="Challenge updated successfully.",
            data=serializer.data,
        )

class ChallengeDeleteView(DestroyAPIView):

    queryset = Challenge.objects.all()

    permission_classes = [
        IsAuthenticated,
        IsCompany,
        IsChallengeOwner,
    ]

    def destroy(
        self,
        request,
        *args,
        **kwargs,
    ):

        instance = self.get_object()

        instance.delete()

        return api_response(
            success=True,
            message="Challenge deleted successfully.",
        )

class MyChallengesView(ListAPIView):

    serializer_class = ChallengeListSerializer

    permission_classes = [
        IsAuthenticated,
        IsCompany,
    ]
     pagination_class = StandardPagination

    def get_queryset(self):

        return Challenge.objects.filter(
            company__user=self.request.user
        )
