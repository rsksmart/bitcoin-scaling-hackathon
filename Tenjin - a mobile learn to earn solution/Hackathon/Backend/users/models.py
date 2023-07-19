from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db import models
from django_s3_storage.storage import S3Storage
from chapter.models import Chapter
from project.settings import S3_STATIC_STORAGE_BUCKET
from social.models import Friend
import random
import string



def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename> if locally
    return f'{instance.username}/{filename}'


def generate_referral_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=7))


# file will be uploaded to S3 bucket in not in local env
s3_storage= S3Storage(aws_s3_bucket_name=S3_STATIC_STORAGE_BUCKET)


class User(AbstractUser):
    # Field used for login
    USERNAME_FIELD = 'email'

    # Additional fields required when using createsuperuser
    REQUIRED_FIELDS = ['username']

    email = models.EmailField(unique=True)

    username_validator = UnicodeUsernameValidator()

    username = models.CharField(
        ("username"),
        max_length=150,
        unique=True,
        validators=[username_validator],
        blank=True,
        null=True,
    )

    notification_token = models.CharField(max_length=255, blank=True, null=True)

    personal_referral_code = models.CharField(max_length=20, blank=True, default='')

    given_referral_code = models.CharField(max_length=20, blank=True)

    is_first_login = models.BooleanField(default=True)

    is_verified = models.BooleanField(default=False)

    email_sent = models.BooleanField(default=False)

    is_subscribed = models.BooleanField(default=False)

    phone = models.CharField(max_length=20, blank=True, null=True)

    wallet_address = models.CharField(max_length=255, blank=True, null=True)

    if settings.IS_LOCAL_DEV:
        avatar = models.ImageField(upload_to=user_directory_path, blank=True, null=True)
    else:
        avatar = models.ImageField(storage=s3_storage, blank=True, null=True)

    about_me = models.CharField(
        verbose_name='user description',
        max_length=1000,
        blank=True
    )

    followees = models.ManyToManyField(
        verbose_name='followees',
        to=settings.AUTH_USER_MODEL,
        related_name='followers',
        blank=True,
    )

    @property
    def friends(self):
        friends_profiles = []

        received_requests = Friend.objects.filter(
            receiver=self,
            status='A'
        )
        for friend in received_requests:
            friends_profiles.append(friend.requester)
        requested_requests = Friend.objects.filter(
            requester=self,
            status='A'
        )
        for friend in requested_requests:
            friends_profiles.append(friend.receiver)
        return friends_profiles

    @property
    def friend_requests_received(self):
        friends_profiles = []

        received_requests = Friend.objects.filter(
            receiver=self,
            status='P'
        )
        for friend in received_requests:
            friends_profiles.append(friend.requester)
        return friends_profiles

    @property
    def friend_requests_sent(self):
        friends_profiles = []

        requested_requests = Friend.objects.filter(
            requester=self,
            status='P'
        )
        for friend in requested_requests:
            friends_profiles.append(friend.receiver)
        return friends_profiles

    @property
    def friend_requests_sent_rejected(self):
        friends_profiles = []

        rejected_requests = Friend.objects.filter(
            requester=self,
            status='R'
        )
        for friend in rejected_requests:
            friends_profiles.append(friend.receiver)
        return friends_profiles

    def save(self, *args, **kwargs):
        if not self.personal_referral_code:
            self.personal_referral_code = generate_referral_code()
            while User.objects.filter(personal_referral_code=self.personal_referral_code).exists():
                self.personal_referral_code = generate_referral_code()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.id}:  {self.username}'

    def get_full_name(self):
        return f'{self.first_name} {self.last_name}'

    def get_short_name(self):
        return self.username


