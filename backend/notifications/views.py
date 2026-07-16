from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from common.pagination import (
    StandardPagination
)
from common.responses import api_response
from .models import Notification
from .serializers import NotificationSerializer

class NotificationListView(
    generics.ListAPIView
):

    serializer_class = NotificationSerializer

    permission_classes = [IsAuthenticated]

    pagination_class = (StandardPagination)

    def get_queryset(self):

        return (
            Notification.objects
            .filter(recipient=self.request.user)
            .order_by("-created_at")
        )

class MarkNotificationReadView(
    generics.UpdateAPIView
):

    serializer_class = NotificationSerializer

    permission_classes = [
        IsAuthenticated
    ]

    http_method_names = [
        "patch"
    ]

    def get_queryset(self):

        return Notification.objects.filter(
            recipient=self.request.user
        )

    def patch(
        self,
        request,
        *args,
        **kwargs
    ):

        notification = self.get_object()
        notification.is_read = True
        notification.save(
            update_fields=[
                "is_read"
            ]
        )
        serializer = self.get_serializer(
            notification
        )

        return Response(
            api_response(
                success=True,
                message=(
                    "Notification marked as read."
                ),
                data=serializer.data,
            )
        )

class MarkAllNotificationsReadView(generics.GenericAPIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(
        self,
        request
    ):
        updated_count = (
            Notification.objects
            .filter(
                recipient=request.user,
                is_read=False,
            )
            .update(
                is_read=True
            )
        )
        return Response(
            api_response(
                success=True,
                message=(
                    "All notifications marked as read."
                ),
                data={
                    "updated_count":
                    updated_count
                },
            )    
        )