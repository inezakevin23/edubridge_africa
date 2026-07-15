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

        if request.user.role != self.required_role:
            raise RolePermissionDenied(
                detail=f"Only {self.role_name} users can perform this action."
            )
        
        return True