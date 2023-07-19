from django.db import models
from chapter.models import Chapter
from class_quiz.models import ClassQuiz


class ChapterQuiz(models.Model):

    question_name = models.ForeignKey(to=ClassQuiz, on_delete= models.PROTECT)
    chapter = models.ForeignKey(to=Chapter,on_delete= models.PROTECT, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):

        return f'{self.pk}, {self.question_name}'


    class Meta:
        verbose_name = 'chapter_quiz'
        verbose_name_plural = 'chapters_quiz'
