from rest_framework import serializers
from class_quiz.models import ClassQuiz


class ClassQuizSerializer(serializers.ModelSerializer):

    singleclass = serializers.SerializerMethodField()

    def get_singleclass(self,obj):
         return obj.singleclass.title

    class Meta:
        model = ClassQuiz
        fields = '__all__'


class CreateClassQuizSerializer(serializers.ModelSerializer):


    class Meta:
        model = ClassQuiz
        fields = '__all__'
