from django.contrib import admin
from category.admin import academy_site
from lesson_attempt.models import LessonAttempt


class LessonAttemptAdmin(admin.ModelAdmin):

    # fields which are shown when looking at a list of instances
    list_display = ('id', 'user', 'chapter', 'lesson', 'collected_xp', 'status')
    list_filter = ('created_at',)
    search_fields = ('user__username',)
    ordering = ('id', 'user')




admin.site.register(LessonAttempt, LessonAttemptAdmin)

academy_site.register(LessonAttempt, LessonAttemptAdmin)


