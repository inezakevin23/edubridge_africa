from rest_framework import serializers

class InternDashboardStatsSerializer(serializers.Serializer):
    active_challenges = serializers.IntegerField()
    my_submissions = serializers.IntegerField()
    shortlisted_submissions = serializers.IntegerField()
    unread_notifications = serializers.IntegerField()


class CompanyDashboardStatsSerializer(serializers.Serializer):
    active_challenges = serializers.IntegerField()
    total_submissions = serializers.IntegerField()
    reviewed_submissions = serializers.IntegerField()
    shortlisted_submissions = serializers.IntegerField()
