from django.urls import path
from .views import ListCategories, FetchRelatedImage

urlpatterns = [
    #backend/api/category/
    path('', ListCategories.as_view()),
    path('related-images/', FetchRelatedImage.as_view())
]