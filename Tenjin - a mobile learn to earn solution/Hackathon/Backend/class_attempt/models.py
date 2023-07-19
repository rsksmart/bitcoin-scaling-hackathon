from django.contrib.auth import get_user_model
from django.db import models
from class_app.models import Class

User = get_user_model()


class ClassAttempt(models.Model):
    user = models.ForeignKey(to=User, on_delete=models.CASCADE, null=True)
    related_class = models.ForeignKey(to=Class, related_name='attempt', on_delete=models.CASCADE, null=True)
    collected_xp = models.IntegerField(null=True, blank=True, default=0)
    status = models.CharField(
        verbose_name='status',
        max_length=20,
        choices=(
            ('no-completed', 'no-completed'),
            ('completed', 'completed'),
        ),
        default='no-completed'
    )
    is_first_time = models.BooleanField(null=True, blank=True, default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f'{self.pk}, {self.user}'





