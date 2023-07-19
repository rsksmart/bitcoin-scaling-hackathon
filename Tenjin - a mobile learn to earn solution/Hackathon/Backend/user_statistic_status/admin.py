from django.contrib import admin
from user_statistic_status.models import UserStatisticStatus, UserLeaderboardTracking


class UserStatisticStatusAdmin(admin.ModelAdmin):

    # fields which are shown when looking at a list of instances
    list_display = ('id', 'user', 'total_xp', 'RBTC')
    list_filter = ('created_at',)
    search_fields = ('user__username',)
    ordering = ('id',)


class UserLeaderboardTrackingAdmin(admin.ModelAdmin):

    # fields which are shown when looking at a list of instances
    list_display = ('id', 'user', 'xp_value', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username',)
    ordering = ('id',)




admin.site.register(UserStatisticStatus, UserStatisticStatusAdmin)
admin.site.register(UserLeaderboardTracking, UserLeaderboardTrackingAdmin)


