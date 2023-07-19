from django.db import models
from django_s3_storage.storage import S3Storage
from lesson.models import Lesson
from project import settings
from project.settings import S3_STATIC_STORAGE_BUCKET


def class_directory_path(instance, filename):
    return f'{instance.title}/{filename}'


s3_storage = S3Storage(aws_s3_bucket_name=S3_STATIC_STORAGE_BUCKET)


class Class(models.Model):

    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    lesson = models.ForeignKey(to=Lesson, on_delete=models.CASCADE, null=True)
    sequence = models.IntegerField(null=True)
    illustration_image = models.ImageField(upload_to=class_directory_path, blank=True, null=True)
    if settings.IS_LOCAL_DEV:
        illustration_image = models.ImageField(upload_to=class_directory_path, blank=True, null=True)
    else:
        illustration_image = models.ImageField(storage=s3_storage, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.pk}, {self.title}'

    class Meta:
        verbose_name = 'class'
        verbose_name_plural = 'classes'



class AffiliateLink(models.Model):

    service_name = models.CharField(max_length=255)

    link = models.URLField(blank=True, null=True)

    related_class = models.ManyToManyField(to=Class)
    ad_image = models.ImageField(upload_to=class_directory_path, blank=True, null=True)
    # if settings.IS_LOCAL_DEV:
    #     ad_image = models.ImageField(upload_to=class_directory_path, blank=True, null=True)
    # else:
    #     ad_image = models.ImageField(storage=s3_storage, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.pk}, {self.service_name}'