from django.contrib import admin

# Register your models here.
from category.admin import academy_site
from chapter.models import Chapter


class ChapterAdmin(admin.ModelAdmin):

    # fields which are shown when looking at a list of instances
    list_display = ('id', 'name', 'category', 'sequence')
    list_filter = ('created_at', 'category',)
    search_fields = ('name', 'id')
    ordering = ('id',)

admin.site.register(Chapter, ChapterAdmin)

academy_site.register(Chapter, ChapterAdmin)



