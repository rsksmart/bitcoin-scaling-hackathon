from django.urls import path
from class_app.views import ListClasses, RetrieveUpdateDestroyClassByID, \
    ListLessonsClasses
urlpatterns = [
    #/api/class/
    path('', ListClasses.as_view()),
    path('<int:id>/questions/', ListLessonsClasses.as_view()),
    path('<int:id>/', RetrieveUpdateDestroyClassByID.as_view()),

]
