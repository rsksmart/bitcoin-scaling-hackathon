from django.contrib.auth import get_user_model
from django.db import models
from chapter.models import Chapter


User = get_user_model()

class ChapterAttempt(models.Model):

    user = models.ForeignKey(to=User, on_delete= models.CASCADE, null=True)
    chapter = models.ForeignKey(to=Chapter, on_delete= models.CASCADE, null=True)
    collected_Sats = models.PositiveIntegerField(null=True, blank=True)
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
        return f'{self.user}, {self.chapter.name}'



