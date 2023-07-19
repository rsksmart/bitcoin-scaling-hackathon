import os
from datetime import timedelta
from pathlib import Path
import boto3



for k, v in sorted(os.environ.items()):
    print(k+':', v)
print('\n')
# list elements in path environment variable
[print(item) for item in os.environ['PATH'].split(';')]



# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Password ashing
SECRET_KEY = 'django-insecure-7myodg!r^tldk-u#m+$^^&xk)pygoy857-h@fswlzkv&0azvbe'


ALLOWED_HOSTS = ['*']



INSTALLED_APPS = [

    'django.contrib.admin',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.staticfiles',

    # 3rd party
    'rest_framework',
    'rest_framework_simplejwt',
    'drf_yasg',


    #allauth
    'django.contrib.auth',
    'django.contrib.messages',
    'django.contrib.sites',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    'rest_framework.authtoken',

    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'crispy_forms',
    'web3',

    #allauth providers
    #'allauth.socialaccount.providers.facebook',
    'allauth.socialaccount.providers.apple',
    'allauth.socialaccount.providers.google',

    #own
    'category',
    'chapter',
    'chapter_attempt',
    'chapter_quiz',
    'class_app',
    'class_attempt',
    'class_quiz',
    'quiz_answer_class',
    'customer_support',
    'emails',
    'lesson',
    'lesson_attempt',
    'registration_profile',
    'social',
    'user_class_question_record',
    'user_chapter_question_record',
    'user_statistic_status',
    'users',
    'video',
    'referral_payout',
]



GOOGLE_APPLICATION_CREDENTIALS = ''




ELASTICSEARCH_PREFIX='projects'


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]



#Url shortener
SHORTENER_ENABLE_TEST_PATH = True
SHORTENER_ENABLED = True
SHORTENER_MAX_URLS = -1
SHORTENER_MAX_CONCURRENT = -1
SHORTENER_LIFESPAN = -1
SHORTENER_MAX_USES = -1


ROOT_URLCONF = 'project.urls'

#CSRF_TRUSTED_ORIGINS = ['URL']


CLOUDFRONT_DOMAIN = ''

# Django-all-auth config
SITE_ID = 1
OLD_PASSWORD_FIELD_ENABLED=True
LOGOUT_ON_PASSWORD_CHANGE=True
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = 'none'
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_MAX_EMAIL_ADDRESSES = 1
EMAIL_CONFIRMATION_AUTHENTICATED_REDIRECT_URL = ''
ACCOUNT_EMAIL_CONFIRMATION_AUTHENTICATED_REDIRECT_URL = ''
REST_AUTH_SERIALIZERS = {
    'PASSWORD_RESET_SERIALIZER': 'password_reset.serializers.CustomPasswordResetSerializer'
}


AUTHENTICATION_BACKENDS = [
    # Needed to login by username in Django admin, regardless of `allauth`
    'django.contrib.auth.backends.ModelBackend',
    # `allauth` specific authentication methods, such as login by e-mail
    'allauth.account.auth_backends.AuthenticationBackend',
]

WSGI_APPLICATION = 'project.wsgi.application'

# django-s3-storage config
AWS_REGION = 'eu-central-1'


DEBUG = True


# Checking if we are locally or on server
IS_LOCAL_DEV = True

if 'RDS_DB_NAME' in os.environ:
    IS_LOCAL_DEV = False

# RDS Postgres is used when we are on server otherwise sqlite3 is used when locally
if 'RDS_DB_NAME' in os.environ:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': os.environ['RDS_DB_NAME'],
            'USER': os.environ['RDS_USERNAME'],
            'PASSWORD': os.environ['RDS_PASSWORD'],
            'HOST': os.environ['RDS_HOSTNAME'],
            'PORT': os.environ['RDS_PORT'],
        }
    }

else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': 'tenjin',
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

AUTH_USER_MODEL = 'users.User'

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

STATIC_ROOT = os.path.join(BASE_DIR, 'static-files') if DEBUG else '/static-files/'
STATIC_URL = '/static-files/'

MEDIA_URL = '/media-files/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media-files') if DEBUG else '/media-files/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',

}

# JWT Token config
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=90),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=120)
}

# Django rest-auth config telling to use JWT config
REST_USE_JWT = True

# Swagger documentation settings
SWAGGER_SETTINGS = {
    'USE_SESSION_AUTH': False,  # Change settings to True to enable Django Login option
    'LOGIN_URL': 'admin/',  # URL For Django Login
    'LOGOUT_URL': 'admin/logout/',  # URL For Django Logout
    'SECURITY_DEFINITIONS': {# Allows usage of Access token to make requests on the docs.
        'Bearer': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header'
        }
    }
}





# Templates settings
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, "templates")],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                #`allauth` needs this from django
                'django.template.context_processors.request',
            ],
        },
    },
]



S3_STATIC_STORAGE_BUCKET = 'tenjin-static-files'















