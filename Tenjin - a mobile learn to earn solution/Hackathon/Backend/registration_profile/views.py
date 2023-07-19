from allauth.socialaccount.providers.apple.views import AppleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.views import OAuth2CallbackView
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from .serializers import RegistrationSerializer, RegistrationValidationSerializer, PasswordResetSerializer, \
    PasswordResetValidationSerializer
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.views import TokenObtainPairView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView, VerifyEmailView

from users.serializers import UserSerializer

User = get_user_model()


class TokenUserObtainView(TokenObtainPairView):
    """
    post:
    Create a new session for a user. Sends back tokens and user.
    """

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        user = User.objects.get(email=request.data['email'])
        req = request
        req.user = user
        user_serializer = UserSerializer(instance=user, context={'request': req})
        res = {
            'user': user_serializer.data,
            **serializer.validated_data
        }

        return Response(res, status=status.HTTP_200_OK)


class RegistrationView(GenericAPIView):
    """
    post:
    Create a non active user with email info only.
    """
    serializer_class = RegistrationSerializer
    permission_classes = []
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(serializer.validated_data)
        return Response(status=status.HTTP_200_OK)


class RegistrationValidationView(GenericAPIView):
    """
    patch:
    Update user info. Activate user.
    """
    permission_classes = []
    serializer_class = RegistrationValidationSerializer

    def patch(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(serializer.validated_data)
        return Response(status=status.HTTP_200_OK)


class PasswordResetView1(GenericAPIView):
    """
    post:
    Send email with password reset code to user.
    """
    permission_classes = []
    serializer_class = PasswordResetSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.send_password_reset_email()
        return Response(status=status.HTTP_200_OK)


class PasswordResetValidationView(GenericAPIView):
    """
    post:
    Update passwords.
    """
    permission_classes = []
    serializer_class = PasswordResetValidationSerializer

    def patch(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(
            serializer.validated_data,
        )
        return Response(status=status.HTTP_200_OK)




class GoogleLogin(SocialLoginView): # if you want to use Authorization Code Grant, use this

    adapter_class = GoogleOAuth2Adapter


class AppleLogin(SocialLoginView):

    adapter_class = AppleOAuth2Adapter




class VerificationLink(VerifyEmailView):
    template_name = "template/account/email_confirm.html"





