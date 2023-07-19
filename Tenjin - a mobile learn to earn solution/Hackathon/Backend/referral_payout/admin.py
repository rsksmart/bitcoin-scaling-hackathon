from django.contrib import admin

from referral_payout.models import ReferralPayout


class ReferralPayoutAdmin(admin.ModelAdmin):

    # fields which are shown when looking at a list of instances
    list_display = ('id', 'user', 'referring_user', 'paid', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username',)
    ordering = ('id',)



admin.site.register(ReferralPayout, ReferralPayoutAdmin)

