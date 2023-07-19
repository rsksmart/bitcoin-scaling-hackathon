from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView,UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from chapter_attempt.models import ChapterAttempt
from chapter_attempt.serializers import ChapterAttemptAllSerializer




class ListChapterAttemptView(ListAPIView):

    """
    User must be logged-in in order to get his attempted Chapters

    Get all attempted Chapter for logged-in user
    """
    queryset = ChapterAttempt.objects.all()
    serializer_class = ChapterAttemptAllSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Chapter'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)



class UpdateChapterAttemptView(UpdateAPIView):

    """
    Provide the chapter ID

    Update a field in the chapter attempt instant
    """
    queryset = ChapterAttempt.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = ChapterAttemptAllSerializer

    @swagger_auto_schema(tags=['Chapter'])
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @swagger_auto_schema(tags=['Chapter'])
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def update(self, request, *args, **kwargs):
        chapt_obj = ChapterAttempt.objects.filter(user=self.request.user, chapter=self.kwargs.get('pk'))

        if chapt_obj:
            ChapterAttempt.objects.filter(user=self.request.user, chapter=self.kwargs.get('pk')).update(is_first_time=False)
            return Response(status.HTTP_200_OK)
        else:
            return Response(status.HTTP_404_NOT_FOUND)




class UpdateChapterAttemptView(UpdateAPIView):

    """
    User chapter quiz jumped off - Provide the chapter ID

    Update is_first_time to False when logged in user jumps off
    """
    queryset = ChapterAttempt.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = None

    @swagger_auto_schema(tags=['Chapter'])
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @swagger_auto_schema(tags=['Chapter'])
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def update(self, request, *args, **kwargs):
        chapt_obj = ChapterAttempt.objects.filter(user=self.request.user, chapter=self.kwargs.get('pk'))

        if chapt_obj:
            ChapterAttempt.objects.filter(user=self.request.user, chapter=self.kwargs.get('pk')).update(is_first_time=False)
            return Response(status.HTTP_200_OK)
        else:
            return Response(status.HTTP_404_NOT_FOUND)
