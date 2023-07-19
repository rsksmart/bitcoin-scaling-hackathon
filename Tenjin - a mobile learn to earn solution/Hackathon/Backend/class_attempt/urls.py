from django.urls import path
from class_attempt.views import ListClassAttemptAllView,\
    EndClassView

#backend/api/class-attempt/
urlpatterns = [
    path('',ListClassAttemptAllView.as_view()),
    path('end-class/<int:pk>/', EndClassView.as_view()),
]
