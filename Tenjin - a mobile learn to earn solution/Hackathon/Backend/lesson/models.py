from django.db import models
from chapter.models import Chapter
from project import settings
from django_s3_storage.storage import S3Storage
from project.settings import S3_STATIC_STORAGE_BUCKET


def class_directory_path(instance, filename):
    return f'{instance.title}/{filename}'


s3_storage = S3Storage(aws_s3_bucket_name=S3_STATIC_STORAGE_BUCKET)


class Lesson(models.Model):

    title = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=255)
    sequence = models.IntegerField(null=True)
    chapter = models.ForeignKey(to=Chapter, on_delete= models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.pk}, {self.title}'

    class Meta:
        verbose_name = 'lesson'
        verbose_name_plural = 'lessons'



