from django.urls import path
from user_class_question_record.views import ListUserClassQuestionRecord, CreateUserClassQuestionRecord

urlpatterns = [
    #backend/api/class-record/
    path('', ListUserClassQuestionRecord.as_view()),
    path('new/', CreateUserClassQuestionRecord.as_view()),
]

