from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsCompany
from common.pagination import StandardPagination
from common.responses import api_response
from .models import Notification
from .serializers import NotificationSerializer


class SendJobOfferView(generics.GenericAPIView):
    """Send a job offer notification to an intern."""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated, IsCompany]

    def post(self, request):
        recipient_id = request.data.get("recipient_id")
        job_link = request.data.get("job_link", "")

        if not recipient_id:
            return api_response(
                success=False,
                message="recipient_id is required.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        from accounts.models import User
        try:
            recipient = User.objects.get(id=recipient_id)
        except User.DoesNotExist:
            return api_response(
                success=False,
                message="Recipient not found.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        try:
            company_name = request.user.company_profile.company_name
        except Exception:
            company_name = request.user.get_full_name()

        notification = Notification.objects.create(
            recipient=recipient,
            title="Job Offer",
            message=f"Congratulations! {company_name} has sent you a job offer.",
            notification_type=Notification.NotificationType.JOB_OFFER,
            job_link=job_link,
        )

        serializer = NotificationSerializer(notification)
        return api_response(
            success=True,
            message="Job offer sent successfully.",
            data=serializer.data,
            status_code=status.HTTP_201_CREATED,
        )


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardPagination

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user).order_by("-created_at")

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class MarkNotificationReadView(generics.UpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["patch"]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

    def patch(self, request, *args, **kwargs):
        notification = self.get_object()
        notification.is_read = True
        notification.save(update_fields=["is_read"])
        
        serializer = self.get_serializer(notification)

        return api_response(
            success=True,
            message="Notification marked as read.",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )


class MarkAllNotificationsReadView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        updated_count = Notification.objects.filter(
            recipient=request.user, 
            is_read=False
        ).update(is_read=True)
        
        return api_response(
            success=True,
            message="All notifications marked as read.",
            data={"updated_count": updated_count},
            status_code=status.HTTP_200_OK,
        )
