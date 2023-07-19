from rest_framework import serializers
from quiz_answer_class.models import QuizAnsClass


class Quiz_Answer_Class_serializer(serializers.ModelSerializer):

    class Meta:
        model = QuizAnsClass
        fields = '__all__'


class QuizAnswerOptionsSerializer(serializers.ModelSerializer):

    class_questionID = serializers.SerializerMethodField()

    answerID = serializers.SerializerMethodField()

    answer_option = serializers.SerializerMethodField()

    correct_answer = serializers.SerializerMethodField()

    def get_class_questionID(self, obj):
        cl_quest = obj.quiz.id
        return cl_quest

    def get_answerID(self, obj):
        answ_id = obj.id
        return answ_id

    def get_answer_option(self, obj):
        cl_ans_nam = obj.answer_name
        return cl_ans_nam


    def get_correct_answer(self, obj):
        cor_ans= obj.correct_answer
        if cor_ans == 'True':
            return True
        else :
            return False


    class Meta:
        model = QuizAnsClass
        fields = ['class_questionID', 'answerID', 'answer_option',  'correct_answer']

