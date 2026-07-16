from rest_framework.permissions import BasePermission
from accounts.models import User
from common.exceptions import RolePermissionDenied


class IsCompany(BasePermission):
    """
    Allows access only to company users.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
            
        if request.user.role != User.Roles.COMPANY:
            raise RolePermissionDenied(
                detail="Only Company accounts can perform this action."
            )
        return True


class IsIntern(BasePermission):
    """
    Allows access only to Intern users.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
            
        if request.user.role != User.Roles.INTERN:
            raise RolePermissionDenied(
                detail="Only Intern accounts can perform this action."
            )
        return True


class IsChallengeOwner(BasePermission):
    """
    Only the company that created the challenge can edit or delete it.
    """
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
            
        return obj.company.user == request.user
