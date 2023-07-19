from django.urls import path
from user_chapter_question_record.views import ListUserChapterQuestionRecord, CreateUserChapterQuestionRecord



urlpatterns = [
    #backend/api/chapter-record/
    path('', ListUserChapterQuestionRecord.as_view()),
    path('new/', CreateUserChapterQuestionRecord.as_view()),
]

