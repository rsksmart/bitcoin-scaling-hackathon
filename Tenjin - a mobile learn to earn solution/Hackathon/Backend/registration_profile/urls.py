from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

from registration_profile.views import RegistrationView, RegistrationValidationView, TokenUserObtainView, PasswordResetView1, \
    PasswordResetValidationView

app_name = 'registration'





urlpatterns = [
    path('token/', TokenUserObtainView.as_view(), name='retrieve-token-and-user'),
    path('token/refresh/', TokenRefreshView.as_view(), name='retrieve-refreshed-token'),
    path('token/verify/', TokenVerifyView.as_view(), name='verify-token'),
    path('', RegistrationView.as_view(), name='registration'),
    path('validation/', RegistrationValidationView.as_view(), name='registration-validation'),
    path('password-reset/', PasswordResetView1.as_view(), name='password-reset'),
    path('password-reset/validation/', PasswordResetValidationView.as_view(), name='password-reset-validation'),

]
