from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    RegisterSerializer,
    UserSerializer,
)

from .jwt import EmailTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):

    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        tokens = generate_tokens_for_user(user)

        return Response(
            {
                "user": UserSerializer(user).data,
                **tokens,
            },
            status=status.HTTP_201_CREATED,
        )


class EmailLoginView(TokenObtainPairView):
    """
    Login using email and password.
    """

    serializer_class = EmailTokenObtainPairSerializer


class MeView(APIView):
    """
    Return authenticated user.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):

        serializer = UserSerializer(request.user)

        return Response(serializer.data)