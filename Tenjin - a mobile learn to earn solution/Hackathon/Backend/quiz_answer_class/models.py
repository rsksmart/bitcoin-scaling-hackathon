from django.db import models

from class_quiz.models import ClassQuiz


class QuizAnsClass(models.Model):

    quiz = models.ForeignKey(to=ClassQuiz, related_name='quiz_answer',on_delete= models.CASCADE, null=True)
    answer_name = models.CharField(max_length=255)
    sequence = models.IntegerField(null=True, blank=True)
    correct_answer = models.CharField(
        verbose_name='correct_answer',
        max_length = 20,
        choices=(
            ('True', 'True'),
            ('False', 'False'),
        ),
        default=''
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.quiz}, {self.answer_name}'

    class Meta:
        verbose_name = 'quiz_answer_class'
        verbose_name_plural = 'quiz_answers_class'
