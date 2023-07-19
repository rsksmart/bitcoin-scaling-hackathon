from django.urls import path
from lesson.views import ListLessons, LessonUserData, RetrieveUserByID, \
    StartLessonFromCategory
urlpatterns = [
    #backend/api/lesson/
    path('', ListLessons.as_view()),
    path('start/category/', StartLessonFromCategory.as_view()),
    path('progress/<int:pk>/', LessonUserData.as_view()),
    path('<int:pk>/', RetrieveUserByID.as_view()),
]


