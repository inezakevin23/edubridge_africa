from rest_framework.exceptions import PermissionDenied
from rest_framework.views import exception_handler
from .responses import api_response


class RolePermissionDenied(PermissionDenied):

    default_detail = "You do not have permission."

    default_code = "permission_denied"

def custom_exception_handler(exc, context):

    response = exception_handler(exc, context)

    if response is None:
        return response

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