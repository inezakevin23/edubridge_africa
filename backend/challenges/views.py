from django.db import transaction
from django.db.models import Q
from django.http import Http404
from rest_framework import filters, status
from rest_framework.generics import (
    CreateAPIView,
    DestroyAPIView,
    GenericAPIView,
    ListAPIView,
    RetrieveAPIView,
    UpdateAPIView,
)
from rest_framework.permissions import AllowAny, IsAuthenticated

from accounts.models import User
from common.pagination import StandardPagination
from common.responses import api_response
from notifications.models import Notification

from .models import Challenge, ChallengeInvite, ChallengeTeam, TeamMember
from .permissions import IsChallengeOwner, IsCompany
from .serializers import (
    ChallengeCreateUpdateSerializer,
    ChallengeDetailSerializer,
    ChallengeInviteSerializer,
    ChallengeListSerializer,
    ChallengeTeamSerializer,
)


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
    ordering = [
        "-created_at",
    ]

    def get_queryset(self):
        from django.db.models import Count

        queryset = Challenge.objects.filter(status="published")
        industry = self.request.query_params.get("industry")
        if industry:
            queryset = queryset.filter(industry_id=industry)
        queryset = queryset.annotate(
            submissions_count=Count("submissions", distinct=True)
        )
        return queryset

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class ChallengeDetailView(RetrieveAPIView):
    serializer_class = ChallengeDetailSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and hasattr(user, 'company_profile'):
            return Challenge.objects.filter(
                Q(status="published") | Q(company__user=user)
            )
        return Challenge.objects.filter(status="published")

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(
            success=True,
            message="Challenge details retrieved successfully.",
            data=serializer.data,
        )


class ChallengeCreateView(CreateAPIView):
    serializer_class = ChallengeCreateUpdateSerializer
    permission_classes = [
        IsAuthenticated,
        IsCompany,
    ]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        challenge = serializer.save(company=request.user.company_profile)
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

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
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

    def destroy(self, request, *args, **kwargs):
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
        from django.db.models import Count

        return Challenge.objects.filter(company__user=self.request.user).annotate(
            submissions_count=Count("submissions", distinct=True)
        )

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class CreateChallengeTeamView(CreateAPIView):
    serializer_class = ChallengeTeamSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if request.user.role != User.Roles.INTERN:
            return api_response(
                success=False,
                message="Only intern users can create teams.",
                status_code=status.HTTP_403_FORBIDDEN,
            )

        challenge_id = request.data.get("challenge")
        if not challenge_id:
            return api_response(
                success=False,
                message="Challenge is required.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        if ChallengeTeam.objects.filter(challenge_id=challenge_id, leader=request.user).exists():
            return api_response(
                success=False,
                message="You already have a team for this challenge.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        team = ChallengeTeam.objects.create(
            challenge_id=challenge_id, leader=request.user
        )
        
        # Automatically add leader as team member
        TeamMember.objects.create(team=team, user=request.user)

        serializer = ChallengeTeamSerializer(team, context={"request": request})

        return api_response(
            success=True,
            message="Team created successfully.",
            data=serializer.data,
            status_code=status.HTTP_201_CREATED,
        )


class MyTeamsView(ListAPIView):
    serializer_class = ChallengeTeamSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardPagination

    def get_queryset(self):
        return (
            ChallengeTeam.objects
            .filter(members__user=self.request.user)
            .prefetch_related("members__user")
            .distinct()
            .order_by("-created_at")
        )

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class CreateChallengeInviteView(CreateAPIView):
    serializer_class = ChallengeInviteSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        invite = serializer.save()
        
        return api_response(
            success=True,
            message="Invitation sent successfully.",
            data=self.get_serializer(invite).data,
            status_code=status.HTTP_201_CREATED,
        )


class ReceivedInvitesView(ListAPIView):
    serializer_class = ChallengeInviteSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardPagination

    def get_queryset(self):
        return (
            ChallengeInvite.objects
            .filter(receiver=self.request.user)
            .select_related("team", "team__challenge", "sender", "receiver")
            .order_by("-created_at")
        )

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class AcceptChallengeInviteView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            invite = (
                ChallengeInvite.objects
                .select_related("team", "sender")
                .get(id=pk, receiver=request.user)
            )
        except ChallengeInvite.DoesNotExist:
            raise Http404("Invitation not found.")

        if invite.status != "pending":
            return api_response(
                success=False,
                message="This invitation has already been processed.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            TeamMember.objects.get_or_create(team=invite.team, user=request.user)
            invite.status = "accepted"
            invite.save(update_fields=["status"])

            # Mark invitation notification as read
            Notification.objects.filter(
                recipient=request.user,
                notification_type=Notification.NotificationType.CHALLENGE_INVITATION,
                related_object_id=invite.id,
            ).update(is_read=True)

        return api_response(
            success=True,
            message="Invitation accepted successfully.",
            data={
                "invite_id": invite.id,
                "status": invite.status,
            },
            status_code=status.HTTP_200_OK,
        )


class DeclineChallengeInviteView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            invite = ChallengeInvite.objects.get(id=pk, receiver=request.user)
        except ChallengeInvite.DoesNotExist:
            raise Http404("Invitation not found.")

        if invite.status != "pending":
            return api_response(
                success=False,
                message="This invitation has already been processed.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        invite.status = "declined"
        invite.save(update_fields=["status"])