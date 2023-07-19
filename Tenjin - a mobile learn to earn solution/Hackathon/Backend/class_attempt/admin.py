from django.contrib import admin

from category.admin import academy_site
from class_attempt.models import ClassAttempt


class ClassAttemptAdmin(admin.ModelAdmin):



    # fields which are shown when looking at a list of instances
    list_display = ('id', 'user', 'related_class', 'collected_xp', 'status', 'created_at',)
    list_filter = ('created_at',)
    search_fields = ('user__username', 'related_class__title')
    ordering = ('id', 'user')





admin.site.register(ClassAttempt, ClassAttemptAdmin)

academy_site.register(ClassAttempt, ClassAttemptAdmin)


