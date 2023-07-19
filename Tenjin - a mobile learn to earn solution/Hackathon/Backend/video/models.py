from django.db import models




# Create your models here. This is just a test
class VideoGalleries(models.Model):
    video_url = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.id

    class Meta:
        verbose_name = 'video'
        verbose_name_plural = 'videos'


