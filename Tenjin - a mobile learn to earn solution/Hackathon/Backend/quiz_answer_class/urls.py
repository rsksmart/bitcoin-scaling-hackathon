from django.urls import path

from quiz_answer_class.views import  CreateQuizAnswerClass

urlpatterns = [

    path('new/', CreateQuizAnswerClass.as_view()),
]

