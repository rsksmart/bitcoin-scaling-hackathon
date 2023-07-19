from django.utils.decorators import method_decorator
from django.views.decorators.debug import sensitive_post_parameters
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from password_reset.serializers import CustomPasswordResetConfirmSerializer
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _


# Get the UserModel
UserModel = get_user_model()

sensitive_post_parameters_m = method_decorator(
    sensitive_post_parameters(
        'new_password1', 'new_password2',
    ),
)


class CustomPasswordResetConfirmView(GenericAPIView):

    serializer_class = CustomPasswordResetConfirmSerializer
    permission_classes = (AllowAny,)
    throttle_scope = 'dj_rest_auth'

    @sensitive_post_parameters_m
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def post(self, request, *args, **kwargs):
        uid = kwargs.get('uidb64')
        token = kwargs.get('token')
        serializer = self.get_serializer(data=request.data, uid=uid, token=token)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {'detail': _('Password has been reset with the new password.')},
        )
