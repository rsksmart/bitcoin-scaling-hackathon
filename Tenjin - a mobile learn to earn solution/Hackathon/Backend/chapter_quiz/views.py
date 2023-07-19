from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from chapter.models import Chapter
from chapter_quiz.serializers import ChapterQuizSerializer


class ListChapterQuiz(ListAPIView):

    """
    Provide a chapter ID

    Get a random quiz based on a Chapter ID
    """
    queryset = Chapter.objects.all()
    serializer_class = ChapterQuizSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Chapter'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        queryset = self.queryset.filter(id=self.kwargs.get('pk'))
        return queryset







