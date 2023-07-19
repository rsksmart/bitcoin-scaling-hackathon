from django.contrib.auth import get_user_model
from django.db import models



User = get_user_model()


class ReferralPayout(models.Model):

    user = models.ForeignKey(to=User, related_name='referral', on_delete=models.CASCADE, null=True)
    referring_user = models.ForeignKey(to=User, related_name='referring', on_delete=models.CASCADE, null=True)
    paid = models.BooleanField(null=True, blank=True, default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user}, {self.referring_user}"
