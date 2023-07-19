from dj_rest_auth.forms import AllAuthPasswordResetForm
from dj_rest_auth.serializers import PasswordResetSerializer
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import SetPasswordForm
from django.utils.encoding import force_str
from rest_framework import exceptions, serializers
from rest_framework.exceptions import ValidationError

if 'allauth' in settings.INSTALLED_APPS:
    from allauth.account import app_settings
    from allauth.account.adapter import get_adapter
    from allauth.account.forms import default_token_generator
    from allauth.account.utils import (filter_users_by_email,
                                       user_pk_to_url_str, user_username)
    from allauth.utils import build_absolute_uri


# Get the UserModel
UserModel = get_user_model()


# override the allauth reset password form
class CustomPasswordResetForm(AllAuthPasswordResetForm):
    def clean_email(self):
        """
        Invalid email should not raise error, as this would leak users
        for unit test: test_password_reset_with_invalid_email
        """
        email = self.cleaned_data["email"]
        email = get_adapter().clean_email(email)
        self.users = filter_users_by_email(email, is_active=True)
        return self.cleaned_data["email"]

    def save(self, request, **kwargs):
        current_site = get_current_site(request)
        email = self.cleaned_data['email']
        token_generator = kwargs.get('token_generator', default_token_generator)

        for user in self.users:

            temp_key = token_generator.make_token(user)
            uid = user_pk_to_url_str(user)
            # save it to the password reset model
            # password_reset = PasswordReset(user=user, temp_key=temp_key)
            # password_reset.save()

            # send the password reset email
            path = reverse(
                'custom_password_reset_confirm',
                args=[uid, temp_key],
            )

            url = build_absolute_uri(request, path)

            context = {
                'current_site': current_site,
                'user': user,
                'password_reset_url': url,
                'request': request,
                'path': path
            }
            if app_settings.AUTHENTICATION_METHOD != app_settings.AuthenticationMethod.EMAIL:
                context['username'] = user_username(user)
            get_adapter(request).send_mail('account/email/password_reset_key', email, context)

        return self.cleaned_data['email']


# override the allauth serializer
class CustomPasswordResetSerializer(PasswordResetSerializer):
    """
    Serializer for requesting a password reset e-mail.
    """
    def validate_email(self, value):
        # Create PasswordResetForm with the serializer
        self.reset_form = CustomPasswordResetForm(data=self.initial_data)
        if not self.reset_form.is_valid():
            raise serializers.ValidationError(self.reset_form.errors)

        return value


# override the allauth serializer
class CustomPasswordResetConfirmSerializer(serializers.Serializer):
    """
    Serializer for confirming a password reset attempt.
    """
    new_password1 = serializers.CharField(max_length=128)
    new_password2 = serializers.CharField(max_length=128)
    uid = serializers.CharField(read_only=True)
    token = serializers.CharField(read_only=True)

    set_password_form_class = SetPasswordForm

    _errors = {}
    user = None
    set_password_form = None

    # init the uid and Token from the view sent in the URI of the request
    def __init__(self, *args, **kwargs):
        self.uid = kwargs.pop('uid', None)
        self.token = kwargs.pop('token', None)
        super().__init__(*args, **kwargs)

    def custom_validation(self, attrs):
        pass

    def validate(self, attrs):
        if 'allauth' in settings.INSTALLED_APPS:
            from allauth.account.forms import default_token_generator
            from allauth.account.utils import url_str_to_user_pk as uid_decoder
        else:
            from django.contrib.auth.tokens import default_token_generator
            from django.utils.http import urlsafe_base64_decode as uid_decoder

        # Decode the uidb64 (allauth use base36) to uid to get User object
        try:
            uid = force_str(uid_decoder(self.uid))
            self.user = UserModel._default_manager.get(pk=uid)
        except (TypeError, ValueError, OverflowError, UserModel.DoesNotExist):
            raise ValidationError({'uid': ['Invalid value']})

        if not default_token_generator.check_token(self.user, self.token):
            raise ValidationError({'token': ['Invalid value']})

        self.custom_validation(attrs)
        # Construct SetPasswordForm instance
        self.set_password_form = self.set_password_form_class(
            user=self.user, data=attrs,
        )
        if not self.set_password_form.is_valid():
            raise serializers.ValidationError(self.set_password_form.errors)

        return attrs

    def save(self):
        return self.set_password_form.save()
