from django.conf import settings
from django.db import models
from django_s3_storage.storage import S3Storage
from category.models import Category
from project.settings import S3_STATIC_STORAGE_BUCKET


def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return f'{instance.name}/{filename}'

s3_storage= S3Storage(aws_s3_bucket_name=S3_STATIC_STORAGE_BUCKET)


class Chapter(models.Model):
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    category = models.ForeignKey(to=Category, on_delete=models.CASCADE, null=True)
    sequence = models.IntegerField(null=True)
    illustration_image = models.ImageField(upload_to=user_directory_path, blank=True, null=True)
    # if settings.IS_LOCAL_DEV:
    #     illustration_image = models.ImageField(upload_to=user_directory_path, blank=True, null=True)
    # else:
    #     illustration_image = models.ImageField(storage=s3_storage, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.id}, {self.name}'

    class Meta:
        verbose_name = 'chapter'
        verbose_name_plural = 'chapters'


