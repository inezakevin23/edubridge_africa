import uuid

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

from .models import (
    Challenge,
    ChallengeInvite,
    ChallengeTeam,
    TeamMember,
    close_expired_challenges,
)
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

        close_expired_challenges()
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
        close_expired_challenges()
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

        close_expired_challenges()
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

        # Validate that the challenge exists
        try:
            uuid.UUID(str(challenge_id))
        except (ValueError, TypeError):
            return api_response(
                success=False,
                message="Invalid challenge ID format.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        if not Challenge.objects.filter(id=challenge_id).exists():
            return api_response(
                success=False,
                message="Challenge not found.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        existing_team = ChallengeTeam.objects.filter(
            challenge_id=challenge_id,
            members__user=request.user,
        ).prefetch_related("members__user").first()
        if existing_team:
            serializer = ChallengeTeamSerializer(existing_team, context={"request": request})
            return api_response(
                success=True,
                message="You already have a team for this challenge.",
                data=serializer.data,
                status_code=status.HTTP_200_OK,
            )

        try:
            with transaction.atomic():
                team = ChallengeTeam.objects.create(
                    challenge_id=challenge_id, leader=request.user
                )
                
                # Automatically add leader as team member
                TeamMember.objects.create(team=team, user=request.user, role="Team Leader")

            serializer = ChallengeTeamSerializer(team, context={"request": request})

            return api_response(
                success=True,
                message="Team created successfully.",
                data=serializer.data,
                status_code=status.HTTP_201_CREATED,
            )
        except Exception as e:
            return api_response(
                success=False,
                message=f"Failed to create team: {str(e)}",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class MyTeamsView(ListAPIView):
    serializer_class = ChallengeTeamSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardPagination

    def get_queryset(self):
        return (
            ChallengeTeam.objects
            .filter(
                Q(members__user=self.request.user) | Q(leader=self.request.user)
            )
            .prefetch_related("members__user")
            .distinct()
            .order_by("-created_at")
        )

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return api_response(
            success=True,
            message="Teams retrieved successfully.",
            data=serializer.data,
        )


class UpdateTeamMemberRoleView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, team_pk, member_pk):
        try:
            team = ChallengeTeam.objects.get(id=team_pk, leader=request.user)
            member = TeamMember.objects.get(id=member_pk, team=team)
        except (ChallengeTeam.DoesNotExist, TeamMember.DoesNotExist):
            raise Http404("Team member not found.")

        role = str(request.data.get("role", "")).strip()
        if not role or len(role) > 100:
            return api_response(
                success=False,
                message="Provide a team role of up to 100 characters.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        member.role = role
        member.save(update_fields=["role"])
        return api_response(
            success=True,
            message="Team member role updated.",
            data=ChallengeTeamSerializer(team).data,
        )


class RemoveTeamMemberView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, team_pk, member_pk):
        try:
            team = ChallengeTeam.objects.get(id=team_pk, leader=request.user)
            member = TeamMember.objects.get(id=member_pk, team=team)
        except (ChallengeTeam.DoesNotExist, TeamMember.DoesNotExist):
            raise Http404("Team member not found.")

        # Cannot remove the team leader
        if member.user == team.leader:
            return api_response(
                success=False,
                message="Cannot remove the team leader.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        member.delete()
        return api_response(
            success=True,
            message="Team member removed successfully.",
            data=ChallengeTeamSerializer(team).data,
        )


class CreateChallengeInviteView(CreateAPIView):
    serializer_class = ChallengeInviteSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        receiver = data.get("receiver")
        if receiver:
            try:
                user = User.objects.get(Q(email__iexact=receiver) | Q(username__iexact=receiver))
                data["receiver"] = str(user.id)
            except User.DoesNotExist:
                pass
        serializer = self.get_serializer(data=data)
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
                .select_related("team", "team__challenge", "sender")
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
            already_member = TeamMember.objects.filter(
                team=invite.team, user=request.user
            ).exists()
            if (
                not already_member
                and invite.team.members.count() >= invite.team.challenge.max_team_size
            ):
                return api_response(
                    success=False,
                    message="This team has reached the challenge's maximum team size.",
                    status_code=status.HTTP_400_BAD_REQUEST,
                )
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
