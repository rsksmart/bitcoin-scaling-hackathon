"""project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from allauth.account.views import ConfirmEmailView
from dj_rest_auth.registration.views import VerifyEmailView
from dj_rest_auth.views import PasswordResetView
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework_simplejwt import views as jwt_views
from category.admin import academy_site
from password_reset.views import CustomPasswordResetConfirmView
from project import settings
from registration_profile.views import GoogleLogin, AppleLogin
from user_statistic_status.graphs import user_signup_stats

schema_view = get_schema_view(
   openapi.Info(
      title="Tenjin API official Documentation",
      default_version='v1',
      description="Description of your Tenjin App",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="riccardo@saynode.ch"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,# Set to False restrict access to protected endpoints
   permission_classes=(permissions.AllowAny,)# Permissions for docs access
)


urlpatterns = [

    path('admin/', admin.site.urls),
    path('academy/', academy_site.urls),

    #django allauth
    path('accounts/', include('allauth.urls')),
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/password/reset/', PasswordResetView.as_view(), name='rest_password_reset'),
    path('auth/password/reset/confirm/<str:uidb64>/<str:token>/', CustomPasswordResetConfirmView.as_view(), name='custom_password_reset_confirm'),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('auth/account-confirm-email/', VerifyEmailView.as_view(), name='account_email_verification_sent'),
    path('confirm-email/<str:key>/', ConfirmEmailView.as_view(),
         name='account_confirm_email'),
    path('auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('auth/apple/', AppleLogin.as_view(), name='apple_callback'),

# Users
    path('api/users/', include('users.urls')),
    path('api/users/status/', include('user_statistic_status.urls')),

# login
    path('auth/login/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),

# social features
    path('api/social/', include('social.urls')),

# Classes
    path('api/class/', include('class_app.urls')),
    path('api/class-attempt/', include('class_attempt.urls')),

# Chapters
    path('api/chapter/', include('chapter.urls')),
    path('api/chapter-attempt/', include('chapter_attempt.urls')),

# Categories
    path('api/category/', include('category.urls')),

# Customer_Support
    path('api/contact_support/', include('customer_support.urls')),

# Lessons
    path('api/lesson/', include('lesson.urls')),

# ClassQuiz
    path('api/class-quiz/', include('class_quiz.urls')),

# ChapterQuiz
    path('api/chapter-quiz/', include('chapter_quiz.urls')),

# Quiz-answer-class
    path('api/quiz-answer-class/', include('quiz_answer_class.urls')),

# User-class-record
    path('api/class-record/', include('user_class_question_record.urls')),

# User-chapter-record
    path('api/chapter-record/', include('user_chapter_question_record.urls')),

# Api documentation
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),

    path('graph/', user_signup_stats, name='graph'),


]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
