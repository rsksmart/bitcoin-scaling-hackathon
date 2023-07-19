from django.contrib import admin

# Register your models here.
from category.admin import academy_site
from class_quiz.models import ClassQuiz
from quiz_answer_class.models import QuizAnsClass


class ClassQuizAdmin(admin.ModelAdmin):



    def related_class(self, obj):
        return obj.singleclass

    def answers(self,obj, *args, **kwargs):
        answ = QuizAnsClass.objects.filter(quiz=obj).all()
        answers = []
        for c in answ:
            answers.append(c.answer_name)
        return answers

    # fields which are shown when looking at a list of instances
    list_display = ('id', 'question_name', 'related_class', 'answers')
    raw_id_fields = ('singleclass',)
    list_filter = ('created_at', ('singleclass', admin.RelatedOnlyFieldListFilter))
    search_fields = ('question_name','id')
    ordering = ('id', 'singleclass')

admin.site.register(ClassQuiz, ClassQuizAdmin)

academy_site.register(ClassQuiz, ClassQuizAdmin)
