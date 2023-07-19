from django.urls import path

from class_quiz.views import ListClassQuiz, CreateClassQuiz, RetrieveUpdateDestroyClassQuizByID

urlpatterns = [
    #backend/api/class-quiz/
    path('', ListClassQuiz.as_view()),
    path('new/', CreateClassQuiz.as_view()),
]

