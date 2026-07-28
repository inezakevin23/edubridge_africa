from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from common.responses import api_response


# Static landing-page content.  These lists can be extended or moved
# to a database-backed model later without changing the API contract.
LANDING_FEATURES = [
    {
        "title": "Connect with Top Companies",
        "description": (
            "Join a network of leading organizations seeking fresh talent "
            "and innovative solutions to real-world problems."
        ),
        "icon": "building",
    },
    {
        "title": "Build Real-World Experience",
        "description": (
            "Solve authentic challenges from partner companies and build a "
            "portfolio that demonstrates your skills to future employers."
        ),
        "icon": "briefcase",
    },
    {
        "title": "Accelerate Your Career",
        "description": (
            "Get noticed by employers, receive expert feedback, and unlock "
            "internship and job opportunities that match your ambitions."
        ),
        "icon": "trending",
    },
    {
        "title": "Learn and Grow",
        "description": (
            "Access curated resources, mentorship programmes, and skill "
            "development opportunities tailored to your career goals."
        ),
        "icon": "graduation",
    },
]

LANDING_STATS = [
    {"number": "10,000+", "label": "Students Connected"},
    {"number": "500+", "label": "Partner Companies"},
    {"number": "200+", "label": "Active Challenges"},
]


class FeaturesView(APIView):
    """Return the static list of landing-page features."""

    permission_classes = [AllowAny]

    def get(self, request):
        return api_response(
            success=True,
            message="Features retrieved successfully.",
            data=LANDING_FEATURES,
            status_code=status.HTTP_200_OK,
        )


class StatsView(APIView):
    """Return the static landing-page statistics."""

    permission_classes = [AllowAny]

    def get(self, request):
        return api_response(
            success=True,
            message="Stats retrieved successfully.",
            data=LANDING_STATS,
            status_code=status.HTTP_200_OK,
        )
