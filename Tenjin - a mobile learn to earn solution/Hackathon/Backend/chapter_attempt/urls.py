from django.urls import path
from chapter_attempt.views import ListChapterAttemptView, UpdateChapterAttemptView

# backend/api/chapter-attempt/

urlpatterns = [
    path('',ListChapterAttemptView.as_view()),
    path('update/<int:pk>/', UpdateChapterAttemptView.as_view()),
]
