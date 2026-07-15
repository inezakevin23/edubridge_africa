from django.urls import path

from .views import (
    ChallengeListView,
    ChallengeDetailView,
    ChallengeCreateView,
    ChallengeUpdateView,
    ChallengeDeleteView,
    MyChallengesView,
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
]