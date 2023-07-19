from drf_yasg.utils import swagger_auto_schema
from rest_framework import filters
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView
from .models import Category
from .serializers import CategorySerializer
from user_statistic_status.serializers import UserMyStatusWithProgressDownload
from rest_framework.permissions import IsAuthenticated

# Chapter views
class ListCategories(ListAPIView):

    """
    List all available Category

    Get request
    """

    queryset = Category.objects.all().order_by('id')
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Category'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        queryset = self.queryset.all()
        return queryset


class FetchRelatedImage(ListAPIView):

    """
    Get all images from current Lesson and the Next Lesson in line

    Get all images from current Lesson and the Next Lesson in line
    """
    queryset = Category.objects.all().order_by('pk')
    serializer_class = UserMyStatusWithProgressDownload
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Category'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


