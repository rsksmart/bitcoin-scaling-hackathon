from drf_yasg.utils import swagger_auto_schema
from rest_framework import filters, status
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.settings import api_settings
from class_attempt.models import ClassAttempt
from class_quiz.models import ClassQuiz
from quiz_answer_class.models import QuizAnsClass
from user_class_question_record.models import UserClassQuestionsRecord
from user_class_question_record.serializers import User_Class_Question_RecordSerializer
from user_statistic_status.models import UserStatisticStatus


class ListUserClassQuestionRecord(ListAPIView):

    """
    Get all Classes Records

    Get a record of every question answered in a Class

    """
    queryset = UserClassQuestionsRecord.objects.all()
    serializer_class = User_Class_Question_RecordSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Class'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class CreateUserClassQuestionRecord(CreateAPIView):

    """
    Create a new Class Record

    Create a new Class Record by posting a question ID, Answer ID, User ID

    """

    queryset = UserClassQuestionsRecord.objects.all()
    serializer_class = User_Class_Question_RecordSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Class'])
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        # set vars with info
        quest = ClassQuiz.objects.filter(id=self.request.data.get('question')).first()
        ans = QuizAnsClass.objects.filter(id=request.data.get('selected_answer'), quiz=quest).first()
        current_user = UserStatisticStatus.objects.get(id=self.request.user.id)
        user_curr_xp = UserStatisticStatus.objects.filter(id=self.request.user.id).first().total_xp
        if ans is None or quest is None:
            return Response({'message': "Please check Question ID or Selected_answer ID, they seem to not match"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            is_first_attempt = ClassAttempt.objects.filter(user=self.request.user,
                                                           related_class=quest.singleclass.id).first()
        if is_first_attempt is None:
            return Response({'message': "User logged in did not start a class attempt matching this class quiz Class"},
                            status=status.HTTP_400_BAD_REQUEST)
        # Result object
        result = {
            "user": self.request.user.id,
            "question": quest.id,
            "selected_answer": ans.id,
            "is_correct": "",
            "xp_collected": 0
        }
        # Checking if the answer is correct, and if first attempt
        # then we add 10 xp to the user and return the result object updated
        if ans.correct_answer == 'True' and is_first_attempt.is_first_time:
            current_user.total_xp = user_curr_xp + 10
            result['is_correct'] = 'True'
            result['xp_collected'] = 10
        # If answer is not correct then no xp, return the result obj updated
        elif ans.correct_answer == 'False':
            result['is_correct'] = 'False'
            result['xp_collected'] = 0
        # if answer is correct but not the first attempt no xp update and returning the result obj updated
        else:
            result['is_correct'] = 'True'
            result['xp_collected'] = 0
        # saving the instance to trigger the Level up method in the model
        current_user.save()
        # Passing the data to the serializer and returning the response
        serializer = self.get_serializer(data=result)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save()

    def get_success_headers(self, data):
        try:
            return {'Location': str(data[api_settings.URL_FIELD_NAME])}
        except (TypeError, KeyError):
            return {}


class RetrieveUpdateDestroyUserClassQuestionRecordByID(RetrieveUpdateDestroyAPIView):
    queryset = UserClassQuestionsRecord.objects.all().order_by('pk')
    serializer_class = User_Class_Question_RecordSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'id'



class SearchUserClassQuestionRecordByStringAPIView(ListAPIView):
    queryset = UserClassQuestionsRecord.objects.all()
    serializer_class = User_Class_Question_RecordSerializer
    permission_classes = []
    filter_backends = [filters.SearchFilter]
    search_fields = ['user_id']


