from django.contrib import admin
from category.admin import academy_site
from lesson.models import Lesson


class LessonAdmin(admin.ModelAdmin):

    # fields which are shown when looking at a list of instances
    list_display = ('id', 'title', 'chapter', 'sequence')
    raw_id_fields = ('chapter',)
    list_filter = ('created_at', 'chapter',)
    search_fields = ('id', 'title',)
    ordering = ('id',)



admin.site.register(Lesson, LessonAdmin)

academy_site.register(Lesson, LessonAdmin)


