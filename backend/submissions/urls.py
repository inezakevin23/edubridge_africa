from django.urls import path
from .views import (
    CompanySubmissionStatisticsView,
    CompanySubmissionsView,
    CreateSubmissionView,
    MySubmissionsView,
    NotifyShortlistedView, 
    ReviewSubmissionView,
    SubmissionDetailView,
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
        "<uuid:id>/",
        SubmissionDetailView.as_view(),
        name="submission-detail",
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
        "company/notify-shortlisted/",
        NotifyShortlistedView.as_view(),
        name="notify-shortlisted",
    ),
    path(
        "company/<uuid:id>/review/",
        ReviewSubmissionView.as_view(),
        name="review-submission",
    ),
]
