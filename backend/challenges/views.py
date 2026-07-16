from django.db.models import Q
from django.db import transaction
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
from .models import (
    Challenge,
    ChallengeTeam,
    TeamMember,
    ChallengeInvite,)
from .permissions import (
    IsCompany,
    IsChallengeOwner,
)
from .serializers import (
    ChallengeListSerializer,
    ChallengeDetailSerializer,
    ChallengeCreateUpdateSerializer,
    ChallengeTeamSerializer,
    ChallengeInviteSerializer,
)
from common.responses import api_response
from common.pagination import StandardPagination
from rest_framework import filters
from notifications.models import Notification


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

class CreateChallengeTeamView(generics.CreateAPIView):

    serializer_class = ChallengeTeamSerializer
    permission_classes = [IsAuthenticated]

    def create(
        self,
        request,
        *args,
        **kwargs
    ):

        if request.user.role != "intern":
            return Response(
                api_response(
                    success=False,
                    message=(
                        "Only intern users can create teams."
                    ),
                    data=None,
                ),
                status=status.HTTP_403_FORBIDDEN,
            )
        challenge_id = request.data.get("challenge")

        if not challenge_id:
            return Response(
                api_response(
                    success=False,
                    message=(
                        "Challenge is required."
                    ),
                    data=None,
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )
        if ChallengeTeam.objects.filter(
            challenge_id=challenge_id,
            leader=request.user,
        ).exists():

            return Response(
                api_response(
                    success=False,
                    message=("You already have a team for this challenge."),
                    data=None,
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )
        team = ChallengeTeam.objects.create(
            challenge_id=challenge_id,
            leader=request.user,
        )
        # Automatically add leader as team member
        TeamMember.objects.create(
            team=team,
            user=request.user,
        )
        serializer = ChallengeTeamSerializer(
            team,
            context={
                "request":
                request
            },
        )

        return Response(
            api_response(
                success=True,
                message=(
                    "Team created successfully."
                ),
                data=serializer.data,
            ),
            status=status.HTTP_201_CREATED,
        )

class MyTeamsView(generics.ListAPIView):

    serializer_class = ChallengeTeamSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = (StandardPagination)

    def get_queryset(self):

        return (
            ChallengeTeam.objects
            .filter(members__user=self.request.user)
            .prefetch_related("members__user")
            .distinct()
            .order_by("-created_at")
        )

class CreateChallengeInviteView(generics.CreateAPIView):

    serializer_class = (ChallengeInviteSerializer)
    permission_classes = [IsAuthenticated]

    def create(
        self,
        request,
        *args,
        **kwargs
    ):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        invite = serializer.save()

        return Response(
            api_response(
                success=True,
                message=("Invitation sent successfully."),
                data=self.get_serializer(invite).data,
            ),
            status=status.HTTP_201_CREATED,
        )

class ReceivedInvitesView(generics.ListAPIView):

    serializer_class = (ChallengeInviteSerializer)
    permission_classes = [IsAuthenticated]
    pagination_class = (StandardPagination)

    def get_queryset(self):

        return (

            ChallengeInvite.objects
            .filter(receiver=self.request.user)
            .select_related("team","team__challenge","sender","receiver",)
            .order_by("-created_at")
        )

class AcceptChallengeInviteView(generics.GenericAPIView):

    permission_classes = [IsAuthenticated]

    def post(
        self,
        request,
        pk
    ):

        invite = (
            ChallengeInvite.objects
            .select_related(
                "team",
                "sender",
            )
            .get(
                id=pk,
                receiver=request.user,
            )
        )
        if invite.status != "pending":

            return Response(
                api_response(
                    success=False,
                    message=("This invitation has already been processed."),
                    data=None,
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            TeamMember.objects.get_or_create(
                team=invite.team,
                user=request.user,)
            invite.status = "accepted"
            invite.save(update_fields=["status"])

            # Mark invitation notification as read
            Notification.objects.filter(
                recipient=request.user,
                notification_type=(
                    Notification.NotificationType
                    .CHALLENGE_INVITATION),
                related_object_id=invite.id,).update(is_read=True)

        return Response(
            api_response(
                success=True,
                message=("Invitation accepted successfully."),
                data={
                    "invite_id":
                    invite.id,
                    "status":
                    invite.status,
                },
            ),
            status=status.HTTP_200_OK,
        )

class DeclineChallengeInviteView(generics.GenericAPIView):
    
    permission_classes = [IsAuthenticated]

    def post(self,request,pk):

        invite = (
            ChallengeInvite.objects
            .get(
                id=pk,
                receiver=request.user,
            )
        )
        if invite.status != "pending":

            return Response(
                api_response(
                    success=False,
                    message=("This invitation has already been processed."),
                    data=None,
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )
        invite.status = "declined"
        invite.save(
            update_fields=["status"]
        )
        Notification.objects.filter(
            recipient=request.user,
            notification_type=(
                Notification.NotificationType
                .CHALLENGE_INVITATION
            ),
            related_object_id=invite.id,
        ).update(
            is_read=True
        )
        return Response(

            api_response(
                success=True,
                message=("Invitation declined successfully."),
                data={
                    "invite_id":
                    invite.id,
                    "status":
                    invite.status,
                },
            ),
            status=status.HTTP_200_OK,
        )