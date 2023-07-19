from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models



User = get_user_model()



class CustomerSupport(models.Model):
    user = models.ForeignKey(to=User, on_delete=models.CASCADE, null=True, related_name='user_email')
    message = models.TextField(max_length=255, blank=True, null=True)
    status = models.CharField(
        verbose_name='status',
        max_length=1,
        choices=(
            ('O', 'Open'),
            ('C', 'Close'),
        ),
        default='O'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user}'

    class Meta:
        verbose_name = 'customer-support'
        verbose_name_plural = 'customer-support'

