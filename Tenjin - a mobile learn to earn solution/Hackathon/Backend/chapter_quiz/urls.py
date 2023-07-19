from django.urls import path

from chapter_quiz.views import ListChapterQuiz

urlpatterns = [
    #backend/api/chapter-quiz/
    path('<int:pk>/', ListChapterQuiz.as_view()),
]

