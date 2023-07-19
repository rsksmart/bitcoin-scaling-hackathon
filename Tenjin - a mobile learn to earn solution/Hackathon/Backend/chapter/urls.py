from django.urls import path
from chapter.views import ListChapters, ListChaptersWithLessons, \
    ListChapterLessonsByCategoryIDAPIView, ListChapterDetailsByCategoryIDAPIView, \
    CategoryStartedAPIView

urlpatterns = [
    #backend/api/chapter/
    path('', ListChapters.as_view()),
    path('category/<int:pk>/', ListChapterLessonsByCategoryIDAPIView.as_view()),
    path('category/details/<int:pk>/', ListChapterDetailsByCategoryIDAPIView.as_view()),
    path('category/started/<int:pk>/', CategoryStartedAPIView.as_view()),
    path('all/', ListChaptersWithLessons.as_view()),
]