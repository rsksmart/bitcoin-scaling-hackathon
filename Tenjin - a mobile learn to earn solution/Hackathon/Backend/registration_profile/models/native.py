from django.contrib.auth import get_user_model
from django.db import models
import random

def code_generator(length=5):
    numbers = '0123456789'
    return ''.join(random.choice(numbers) for _ in range(length))


User = get_user_model()


class RegistrationProfile(models.Model):

    user = models.OneToOneField(
        verbose_name='user',
        on_delete=models.CASCADE,
        related_name='registration_profile',
        to=User,
        blank=True,
        null=True

    )
    code = models.CharField(
        verbose_name='code',
        help_text='random code used for registration and for password reset',
        max_length=15,
        default=code_generator
    )
    code_type = models.CharField(
        verbose_name='code type',
        max_length=2,
        choices=(
            ('RV', 'Registration Validation'),
            ('PR', 'Password Reset')
        )
    )
    code_used = models.BooleanField(
        verbose_name='code used',
        default=False
    )

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user.email}, {self.code}'




