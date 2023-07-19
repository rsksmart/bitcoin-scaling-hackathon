from django.contrib import admin

from category.admin import academy_site
from user_chapter_question_record.models import UserChapterQuestionsRecord


class UserChapterQuestionsRecordAdmin(admin.ModelAdmin):

    # fields which are shown when looking at a list of instances
    list_display = ('id', 'user', 'question','selected_answer', 'is_correct', 'updated_at', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'question__question_name', 'selected_answer__answer_name',)
    ordering = ('id',)

admin.site.register(UserChapterQuestionsRecord, UserChapterQuestionsRecordAdmin)

academy_site.register(UserChapterQuestionsRecord, UserChapterQuestionsRecordAdmin)
