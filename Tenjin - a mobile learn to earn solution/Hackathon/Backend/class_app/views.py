from django.http import  JsonResponse
from drf_yasg.utils import swagger_auto_schema
from rest_framework import filters, status
from rest_framework.generics import ListAPIView, CreateAPIView,RetrieveAPIView, \
    UpdateAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from class_app.models import Class
from class_app.serializers import LessonsClassesSerializer, ClassSerializer, StartClassSerializer, \
    UserClassScoreSerializer, UserClassScoreSerializerNoXp
from rest_framework.response import Response
from class_attempt.models import ClassAttempt
from class_attempt.serializers import QuestionAttemptClassSerializer
from user_class_question_record.models import UserClassQuestionsRecord
from user_statistic_status.models import UserStatisticStatus


class ListClasses(ListAPIView):
    """
    Get all Classes

    Get all Classes
    """
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Class'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class ListLessonsClasses(ListAPIView):

    """
    Pass a Class ID

    Get Question list (quizes) and is_first_attempt= True || False for the Class

    """
    queryset = Class.objects.all()
    serializer_class = LessonsClassesSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    @swagger_auto_schema(tags=['Class'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        queryset = self.queryset.filter(id=self.kwargs.get('id'))
        return queryset



class UserClassScore(ListAPIView):
    """

    Get User Score at the end of each class by Class ID

    Get request

    """
    queryset = ClassAttempt.objects.all()
    serializer_class = UserClassScoreSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    @swagger_auto_schema(tags=['Class'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        queryset1 = self.queryset.filter(user=self.request.user, related_class_id=self.kwargs.get('id'),
                                         is_first_time=True)

        queryset2 = self.queryset.filter(user=self.request.user, related_class_id=self.kwargs.get('id'),
                                         is_first_time=False)

        if not queryset1:
            return queryset2
        else:
            return queryset1


    def get_serializer_class(self):

        queryset = self.queryset.filter(user=self.request.user, related_class_id=self.kwargs.get('id'),
                                        is_first_time=True)
        if not queryset:
            return UserClassScoreSerializerNoXp

        else:
            return UserClassScoreSerializer



class QuestionAttemptClass(CreateAPIView):

    """
    User must be logged-in

    Create a Question attempt by choosing a question ID && Answer ID

    """
    queryset = UserClassQuestionsRecord.objects.all()
    serializer_class = QuestionAttemptClassSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Class'])
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        if request.data.get('xp_collected') >= 0:
            xp = request.data.get('xp_collected')
            user_curr_stat = UserStatisticStatus.objects.filter(id=self.request.user.id).first().total_xp
            UserClassQuestionsRecord.objects.create(user=self.request.user,
                                                    question=request.data.get('question'),
                                                    selected_answer=request.data.get('selected_answer'),
                                                    is_correct=request.data.get('is_correct'),
                                                    xp_collected=request.data.get('xp_collected')
                                                    )
            UserStatisticStatus.objects.filter(id=self.request.user.id).update(total_xp=user_curr_stat + xp)
        return Response(status=status.HTTP_201_CREATED)




class CreateClass(CreateAPIView):


    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [IsAdminUser]



class RetrieveUpdateDestroyClassByID(RetrieveAPIView):

    """
    Get Class details by ID

    Get Class details by ID
    """

    queryset = Class.objects.all().order_by('pk')
    serializer_class = ClassSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'id'

    @swagger_auto_schema(tags=['Class'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(tags=['Class'])
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)


class SearchClassesByStringAPIView(ListAPIView):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']
