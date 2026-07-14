from rest_framework.permissions import BasePermission
from common.exceptions import RolePermissionDenied


class IsAuthenticatedAndRole(BasePermission):
    """
    Base permission that checks authentication
    and compares the user's role.
    """

    required_role = None

    role_name = None

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False
        return (
            request.user.is_authenticated
            and request.user.role == self.required_role
        )