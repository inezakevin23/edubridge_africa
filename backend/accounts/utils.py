from rest_framework_simplejwt.tokens import RefreshToken


def generate_tokens_for_user(user):
    """
    Generate JWT tokens for a user using a single source of truth.
    """

    refresh = RefreshToken.for_user(user)

    # Custom claims
    refresh["email"] = user.email
    refresh["role"] = user.role
    refresh["first_name"] = user.first_name

    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }