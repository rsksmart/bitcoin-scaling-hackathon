from rest_framework import serializers
import random
from chapter.models import Chapter
from chapter_attempt.models import ChapterAttempt
from chapter_quiz.models import ChapterQuiz
from class_quiz.models import ClassQuiz
from quiz_answer_class.models import QuizAnsClass
from quiz_answer_class.serializers import QuizAnswerOptionsSerializer


class ChapterQuizSerializer(serializers.ModelSerializer):

    question_list = serializers.SerializerMethodField()

    def get_question_list(self, obj):
        quest = list(ClassQuiz.objects.filter(singleclass__lesson__chapter_id=obj.id))
        rand = random.sample(quest, k=7)
        return ChapterQuestionSerializer(rand, many=True).data


    class Meta:
        model = Chapter
        fields = ['id', 'question_list']



class ChapterQuestionSerializer(serializers.ModelSerializer):

    options = serializers.SerializerMethodField()


    def get_options(self, obj):
        clQuiz = QuizAnsClass.objects.filter(quiz_id=obj.id)
        return QuizAnswerOptionsSerializer(clQuiz, many=True).data

    class Meta:
        model = ClassQuiz
        fields = ['id', 'question_name','options']