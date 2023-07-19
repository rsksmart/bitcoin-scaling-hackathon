from django.contrib.auth import get_user_model
from django.db import models
from chapter.models import Chapter
from lesson.models import Lesson

User = get_user_model()


class LessonAttempt(models.Model):

    user = models.ForeignKey(to=User,related_name='user_lessons_status', on_delete= models.CASCADE, null=True, blank=True)
    chapter = models.ForeignKey(to=Chapter, related_name='chapter_related', on_delete= models.CASCADE, null=True, blank=True)
    lesson = models.ForeignKey(to=Lesson, related_name='lessons_related', null=True, on_delete= models.CASCADE, blank=True)
    collected_xp = models.IntegerField(null=True, blank=True)
    status = models.CharField(
        verbose_name='status',
        max_length=20,
        choices=(
            ('no-completed', 'no-completed'),
            ('completed', 'completed'),
        ),
        default='no-completed'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



    def __str__(self):
        return f'{self.pk}, {self.user}'




