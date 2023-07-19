from django.db import models
from django_s3_storage.storage import S3Storage
from django.conf import settings
# from project.settings import S3_STATIC_STORAGE_BUCKET


def directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename> if locally
    return f'{instance.pk}/{filename}'

# file will be uploaded to S3 bucket in not in local env
# s3_storage= S3Storage(aws_s3_bucket_name=S3_STATIC_STORAGE_BUCKET)

class Category(models.Model):

    category_name = models.CharField(max_length=255)
    sequence = models.IntegerField(null=True)

    text = models.CharField(max_length=100,blank=True, null=True )

    description = models.ImageField(upload_to=directory_path, blank=True, null=True)

    # if settings.IS_LOCAL_DEV:
    #
    #     description = models.ImageField(upload_to=directory_path,blank=True, null=True)
    # else:
    #
    #     description = models.ImageField(storage=s3_storage, blank=True, null=True)

    icon = models.ImageField(upload_to=directory_path, blank=True, null=True)
    # if settings.IS_LOCAL_DEV:
    #
    #     icon = models.ImageField(upload_to=directory_path,blank=True, null=True)
    # else:
    #
    #     icon = models.ImageField(storage=s3_storage, blank=True, null=True)

    activated = models.BooleanField(null=True, blank=True, default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.pk}, {self.category_name}'

    class Meta:
        verbose_name = 'category'
        verbose_name_plural = 'categories'


