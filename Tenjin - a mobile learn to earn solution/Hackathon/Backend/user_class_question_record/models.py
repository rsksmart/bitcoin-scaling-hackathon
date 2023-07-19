from django.contrib.auth import get_user_model
from django.db import models
from class_quiz.models import ClassQuiz
from quiz_answer_class.models import QuizAnsClass


User = get_user_model()


class UserClassQuestionsRecord(models.Model):

    user = models.ForeignKey(to=User, related_name='user_class_question_record', on_delete=models.CASCADE, null=True)
    question = models.ForeignKey(to=ClassQuiz, related_name='question_selected', on_delete=models.CASCADE, null=True, blank=True)
    selected_answer = models.ForeignKey(to=QuizAnsClass, related_name='answer_selected',  on_delete=models.CASCADE, null=True, blank=True)
    is_correct = models.CharField(
        verbose_name='status',
        max_length=10,
        choices=(
            ('True', 'True'),
            ('False', 'False'),
        ),
        default=''
    )
    xp_collected = models.IntegerField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f'{self.pk}'

    class Meta:
        verbose_name = 'user_class_question_record'
        verbose_name_plural = 'user_class_question_records'

