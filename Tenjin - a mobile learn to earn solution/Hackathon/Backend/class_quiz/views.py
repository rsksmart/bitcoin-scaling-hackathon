
from django.shortcuts import render
from drf_yasg.utils import swagger_auto_schema

# Create your views here.

from rest_framework import filters
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated

from class_quiz.models import ClassQuiz
from class_quiz.serializers import ClassQuizSerializer, CreateClassQuizSerializer


# Create your views here.


class ListClassQuiz(ListAPIView):

    """
    Get all Class Quizzes that exist

    Get all quizzes and in which Class they appear

    """

    queryset = ClassQuiz.objects.all()
    serializer_class = ClassQuizSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Class'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class CreateClassQuiz(CreateAPIView):
    """
    Provide Class ID

    Create a new quiz for chosen Class

    """
    queryset = ClassQuiz.objects.all()
    serializer_class = CreateClassQuizSerializer
    permission_classes = [IsAdminUser]

    @swagger_auto_schema(tags=['Class'])
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class RetrieveUpdateDestroyClassQuizByID(RetrieveUpdateDestroyAPIView):
    queryset = ClassQuiz.objects.all().order_by('pk')
    serializer_class = ClassQuizSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'id'




