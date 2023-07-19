from django.contrib import admin

from category.admin import academy_site
from chapter_attempt.models import ChapterAttempt


class ChapterAttemptAdmin(admin.ModelAdmin):

    # fields which are shown when looking at a list of instances
    list_display = ('id', 'user', 'chapter', 'collected_Sats', 'status', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username',)
    ordering = ('id', 'user')


admin.site.register(ChapterAttempt, ChapterAttemptAdmin)

academy_site.register(ChapterAttempt, ChapterAttemptAdmin)


