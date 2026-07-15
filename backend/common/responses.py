from rest_framework import status
from rest_framework.response import Response


def api_response(
    *,
    success: bool,
    message: str,
    data=None,
    errors=None,
    status_code=status.HTTP_200_OK,
):
    """
    Standard API response format used across the project.
    """

    return Response(
        {
            "success": success,
            "message": message,
            "data": data,
            "errors": errors,
        },
        status=status_code,
    )