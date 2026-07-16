from django.urls import path

from .views import (
    ChallengeListView,
    ChallengeDetailView,
    ChallengeCreateView,
    ChallengeUpdateView,
    ChallengeDeleteView,
    MyChallengesView,
    CreateChallengeTeamView,
    MyTeamsView,
    CreateChallengeInviteView,
    ReceivedInvitesView,
    AcceptChallengeInviteView,
    DeclineChallengeInviteView,
)

urlpatterns = [

    path(
        "",
        ChallengeListView.as_view(),
        name="challenge-list",
    ),

    path(
        "my/",
        MyChallengesView.as_view(),
        name="my-challenges",
    ),

    path(
        "create/",
        ChallengeCreateView.as_view(),
        name="challenge-create",
    ),

    path(
        "<int:pk>/",
        ChallengeDetailView.as_view(),
        name="challenge-detail",
    ),

    path(
        "<int:pk>/update/",
        ChallengeUpdateView.as_view(),
        name="challenge-update",
    ),

    path(
        "<int:pk>/delete/",
        ChallengeDeleteView.as_view(),
        name="challenge-delete",
    ),
     path(
        "teams/",
        CreateChallengeTeamView.as_view(),
        name="create-team",
    ),

    path(
        "teams/my/",
        MyTeamsView.as_view(),
        name="my-teams",
    ),

    # Invitations
    path(
        "invites/",
        CreateChallengeInviteView.as_view(),
        name="create-invite",
    ),

    path(
        "invites/received/",
        ReceivedInvitesView.as_view(),
        name="received-invites",
    ),

    path(
        "invites/<int:pk>/accept/",
        AcceptChallengeInviteView.as_view(),
        name="accept-invite",
    ),

    path(
        "invites/<int:pk>/decline/",
        DeclineChallengeInviteView.as_view(),
        name="decline-invite",
    ),
]