from django.contrib import admin

from social.models import Friend


class FriendAdmin(admin.ModelAdmin):

    # fields which are shown when looking at a list of instances
    list_display = ('id', 'requester', 'receiver', 'status')
    search_fields = ('requester__username', 'receiver__username',)
    ordering = ('id',)
    list_filter = ('status',)

admin.site.register(Friend, FriendAdmin)
