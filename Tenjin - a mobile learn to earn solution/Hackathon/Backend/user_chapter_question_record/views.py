from drf_yasg.utils import swagger_auto_schema
from rest_framework import filters
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from user_chapter_question_record.models import UserChapterQuestionsRecord
from user_chapter_question_record.serializers import UserChapterQuestionRecordSerializer



class ListUserChapterQuestionRecord(ListAPIView):

    """
    Get all Chapters records

    Get a record of all questions and answers for all Chapters

    """
    queryset = UserChapterQuestionsRecord.objects.all()
    serializer_class = UserChapterQuestionRecordSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Chapter'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class CreateUserChapterQuestionRecord(CreateAPIView):

    """
    Create a new Chapter record manually

    Create a new question answer record
    """

    queryset = UserChapterQuestionsRecord.objects.all()
    serializer_class = UserChapterQuestionRecordSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Chapter'])
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class RetrieveUpdateDestroyUserChapterQuestionRecordByID(RetrieveUpdateDestroyAPIView):
    queryset = UserChapterQuestionsRecord.objects.all().order_by('pk')
    serializer_class = UserChapterQuestionRecordSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'



class SearchUserClassQuestionRecordByStringAPIView(ListAPIView):
    queryset = UserChapterQuestionsRecord.objects.all()
    serializer_class = UserChapterQuestionRecordSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['user_id']


