from rest_framework.permissions import BasePermission


class IsCompany(BasePermission):
    """
    Allows access only to company users.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "company"
        )


class IsIntern(BasePermission):
    """
    Allows access only to Intern users.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "intern"
        )


class IsChallengeOwner(BasePermission):
    """
    Only the company that created the challenge
    can edit or delete it.
    """

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):

        return obj.company.user == request.user