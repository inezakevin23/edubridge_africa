from django.urls import path
from .views import NotificationListView, MarkNotificationReadView, MarkAllNotificationsReadView, SendJobOfferView

urlpatterns = [
    path("", NotificationListView.as_view(), name="notification-list"),
    path("<uuid:pk>/read/", MarkNotificationReadView.as_view(), name="mark-notification-read"),
    path("read-all/", MarkAllNotificationsReadView.as_view(), name="mark-all-notifications-read"),
    path("send-job-offer/", SendJobOfferView.as_view(), name="send-job-offer"),
]
