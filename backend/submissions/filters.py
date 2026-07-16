import django_filters

from .models import Submission


class SubmissionFilter(
    django_filters.FilterSet
):

    challenge = django_filters.UUIDFilter(
        field_name="challenge"
    )

    class Meta:

        model = Submission

        fields = [
            "challenge",
            "status",
            "is_shortlisted",
        ]