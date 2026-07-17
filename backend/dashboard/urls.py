from django.urls import path
from .views import CompanyDashboardStatsView, InternDashboardStatsView

urlpatterns = [
    path(
        "intern/", 
        InternDashboardStatsView.as_view(), 
        name="intern-dashboard-stats"
    ),
    path(
        "company/", 
        CompanyDashboardStatsView.as_view(), 
        name="company-dashboard-stats"
    ),
] 
