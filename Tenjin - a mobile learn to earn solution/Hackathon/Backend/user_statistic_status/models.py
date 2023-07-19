from decimal import Decimal

from allauth.account.models import EmailAddress
from django.contrib.auth import get_user_model
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from category.models import Category
from class_attempt.models import ClassAttempt
from referral_payout.models import ReferralPayout
from user_chapter_question_record.models import UserChapterQuestionsRecord
from user_class_question_record.models import UserClassQuestionsRecord
from allauth.socialaccount.models import SocialAccount



User = get_user_model()



class UserStatisticStatus(models.Model):

    user = models.ForeignKey(to=User, related_name='user', on_delete=models.CASCADE, null=True)
    total_xp = models.PositiveIntegerField(default=0, null=True, blank=True)
    RBTC = models.PositiveBigIntegerField(default=50)
    level = models.PositiveIntegerField(default=1, null=True, blank=True)
    current_category = models.PositiveIntegerField(default=0, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



    def save(self, *args, **kwargs):

        level = self.calculate_level()
        previous_level = self.level
        self.level = level
        super().save(*args, **kwargs)


    def calculate_level(self):
        if self.total_xp <= 700:
            return 1
        elif self.total_xp > 700 and self.total_xp <= 2000:
            return 2
        elif self.total_xp > 2000 and self.total_xp <= 4000:
            return 3
        elif self.total_xp > 4000 and self.total_xp <= 7000:
            return 4
        elif self.total_xp > 7000 and self.total_xp <= 11000:
            return 5
        elif self.total_xp > 11000 and self.total_xp <= 16000:
            return 6
        elif self.total_xp > 16000 and self.total_xp <= 22000:
            return 7
        elif self.total_xp > 22000 and self.total_xp <= 37000:
            return 8
        elif self.total_xp > 37000 and self.total_xp <= 46000:
            return 9
        elif self.total_xp > 46000:
            return 10



    class Meta:
        verbose_name = 'user_statistics_status'
        verbose_name_plural = 'users_statistics_status'

    @receiver(post_save, sender=User)
    def create_user_statistic_status(sender, instance, **kwargs):
        profile, created = UserStatisticStatus.objects.get_or_create(id=instance.id, user=instance)
        if created:
            profile.save()


class UserLeaderboardTracking(models.Model):

    user = models.ForeignKey(to=User, related_name='user_leaderboard', on_delete=models.CASCADE, null=True)
    xp_value = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"id : {self.pk} Username : {self.user}"

    @receiver(post_save, sender=UserClassQuestionsRecord)
    def create_user_leaderboard_tracking(sender, instance, *args, **kwargs):
        if instance.xp_collected == 0:
            pass
        else:
            UserLeaderboardTracking.objects.create(user=instance.user,
                                                   xp_value=instance.xp_collected)







