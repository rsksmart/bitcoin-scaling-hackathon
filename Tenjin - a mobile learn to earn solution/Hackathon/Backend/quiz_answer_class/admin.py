from django.contrib import admin
from category.admin import academy_site
from quiz_answer_class.models import QuizAnsClass




class QuizAnsClassAdmin(admin.ModelAdmin):


    def related_class(self, obj):
        return obj.quiz.singleclass.title

    # fields which are shown when looking at a list of instances
    list_display = ('id', 'quiz', 'answer_name', 'correct_answer', 'related_class')
    raw_id_fields = ('quiz',)
    list_filter = ('created_at', 'quiz__singleclass__title')
    search_fields = ('answer_name', 'quiz__question_name', 'quiz_id')

    ordering = ('id',)

admin.site.register(QuizAnsClass, QuizAnsClassAdmin)

academy_site.register(QuizAnsClass, QuizAnsClassAdmin)

