from django.db import models
from django.conf import settings





class Friend(models.Model):

    requester = models.ForeignKey(
        to=settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='requests_sent'
    )
    receiver = models.ForeignKey(
        to=settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='requests_received'
    )
    status = models.CharField(
        verbose_name='status',
        max_length=1,
        choices=(
            ('P', 'Pending'),
            ('A', 'Accepted'),
            ('R', 'Rejected')
        ),
        default='P'
    )
    is_blocked = models.BooleanField(default=False, blank=True, null=True)

    class Meta:
        unique_together = ['requester', 'receiver']

    def __str__(self):
        return f'{self.requester}, {self.receiver}, {self.status}'

