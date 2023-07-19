from django.shortcuts import render
from drf_yasg.utils import swagger_auto_schema

# Create your views here.

from rest_framework import filters
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAdminUser

from quiz_answer_class.models import QuizAnsClass
from quiz_answer_class.serializers import Quiz_Answer_Class_serializer



class CreateQuizAnswerClass(CreateAPIView):

    queryset = QuizAnsClass.objects.all()
    serializer_class = Quiz_Answer_Class_serializer
    permission_classes = [IsAdminUser]

    @swagger_auto_schema(tags=['Class'])
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


