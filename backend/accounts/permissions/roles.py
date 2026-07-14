from accounts.models import User
from .base import IsAuthenticatedAndRole


class IsIntern(IsAuthenticatedAndRole):
    """
    Allows access only to Intern users.
    """

    required_role = User.Roles.INTERN
    role_name = "intern"


class IsCompany(IsAuthenticatedAndRole):
    """
    Allows access only to Company users.
    """

    required_role = User.Roles.COMPANY
    role_name = "company"


class IsAdmin(IsAuthenticatedAndRole):
    """
    Allows access only to Administrators.
    """

    required_role = User.Roles.ADMIN
    role_name = "admin"