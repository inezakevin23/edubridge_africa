from rest_framework.permissions import BasePermission


class IsIntern(BasePermission):

    def has_permission(self, request, view):

        return (
            request.user.is_authenticated
            and request.user.role == "intern"
        )


class IsCompany(BasePermission):

    def has_permission(self, request, view):

        return (
            request.user.is_authenticated
            and request.user.role == "company"
        )