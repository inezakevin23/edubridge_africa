from django.urls import path

from .views import (
    CreateSubmissionView,
    MySubmissionsView,
    SubmissionDetailView,
    CompanySubmissionsView,
    ReviewSubmissionView,
    CompanySubmissionStatisticsView,
)


urlpatterns = [
    path(
        "",
        CreateSubmissionView.as_view(),
        name="create-submission",
    ),

    path(
        "my/",
        MySubmissionsView.as_view(),
        name="my-submissions",
    ),

    path(
        "company/",
        CompanySubmissionsView.as_view(),
        name="company-submissions",
    ),

    path(
        "company/statistics/",
        CompanySubmissionStatisticsView.as_view(),
        name="company-submission-statistics",
    ),

    path(
        "company/<int:pk>/review/",
        ReviewSubmissionView.as_view(),
        name="review-submission",
    ),

    path(
        "<int:pk>/",
        SubmissionDetailView.as_view(),
        name="submission-detail",
    ),
]