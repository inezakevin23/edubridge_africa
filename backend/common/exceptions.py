from rest_framework.exceptions import PermissionDenied


class RolePermissionDenied(PermissionDenied):

    default_detail = "You do not have permission."

    default_code = "permission_denied"