from django.db import models
from class_app.models import Class


class ClassQuiz(models.Model):

    question_name = models.CharField(max_length=255)
    explanation = models.TextField(blank=True, null=True, max_length=510)
    singleclass = models.ForeignKey(to=Class, related_name='single_quiz', verbose_name="related class", on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f'{self.pk}, {self.question_name}'

    class Meta:
        verbose_name = 'class_quiz'
        verbose_name_plural = 'class_quiz'
