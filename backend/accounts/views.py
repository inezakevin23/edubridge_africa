from rest_framework import generics, permissions, status
from rest_framework.views import APIView

from rest_framework_simplejwt.views import TokenObtainPairView

from .jwt import EmailTokenObtainPairSerializer
from .serializers import (
    RegisterSerializer,
    UserSerializer,
)
from .utils import generate_tokens_for_user
from common.responses import api_response


class RegisterView(generics.CreateAPIView):
    """
    Register a new user and immediately return JWT tokens.
    """

    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        tokens = generate_tokens_for_user(user)

        return api_response(
            success=True,
            message="User registered successfully.",
            data={
                "user": UserSerializer(user).data,
                "tokens": tokens,
            },
            status_code=status.HTTP_201_CREATED,
        )


class EmailLoginView(APIView):
    """
    Login using email and password.
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):

        serializer = EmailTokenObtainPairSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        user = serializer.user

        return api_response(
            success=True,
            message="Login successful.",
            data={
                "user": UserSerializer(user).data,
                "tokens": serializer.validated_data,
            },
            status_code=status.HTTP_200_OK,
        )


class MeView(APIView):
    """
    Return the authenticated user's information.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):

        return api_response(
            success=True,
            message="User information retrieved successfully.",
            data=UserSerializer(request.user).data,
            status_code=status.HTTP_200_OK,
        )
