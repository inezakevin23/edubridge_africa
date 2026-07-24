import traceback
import logging

from django.conf import settings
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import exception_handler

from .responses import api_response


logger = logging.getLogger(__name__)


class RolePermissionDenied(PermissionDenied):

    default_detail = "You do not have permission."

    default_code = "permission_denied"


def custom_exception_handler(exc, context):

    response = exception_handler(exc, context)

    if response is None:
        # Unhandled exception – log it and return a proper JSON error
        logger.error(
            "Unhandled exception in %s: %s",
            context.get("view", None),
            traceback.format_exc(),
        )

        message = "Internal server error."
        if settings.DEBUG:
            message = f"{exc.__class__.__name__}: {exc}"

        return api_response(
            success=False,
            message=message,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    message = "Request failed."

    if isinstance(response.data, dict):

        if "detail" in response.data:
            message = response.data["detail"]

    return api_response(
        success=False,
        message=message,
        errors=response.data,
        status_code=response.status_code,
    )
