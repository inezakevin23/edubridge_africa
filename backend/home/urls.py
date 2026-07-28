from django.urls import path

from .views import FeaturesView, StatsView

urlpatterns = [
    path(
        "features/",
        FeaturesView.as_view(),
        name="home-features",
    ),
    path(
        "stats/",
        StatsView.as_view(),
        name="home-stats",
    ),
]
