from django.urls import path

from .views import (
    IndustryListView,
    InternProfileCreateView,
    InternProfileView,
    CompanyProfileCreateView,
    CompanyProfileView,
)

urlpatterns = [
    path(
        "industries/",
        IndustryListView.as_view(),
        name="industry-list",
    ),

    path(
        "intern/",
        InternProfileCreateView.as_view(),
        name="intern-profile-create",
    ),
    path(
        "intern/me/",
        InternProfileView.as_view(),
        name="intern-profile",
    ),

    path(
        "company/",
        CompanyProfileCreateView.as_view(),
        name="company-profile-create",
    ),
    path(
        "company/me/",
        CompanyProfileView.as_view(),
        name="company-profile",
    ),
]