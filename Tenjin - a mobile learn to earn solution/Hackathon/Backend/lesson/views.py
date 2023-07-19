from drf_yasg.utils import swagger_auto_schema
from rest_framework import  status
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from category.models import Category
from chapter.models import Chapter
from chapter.serializers import ChapterDetailsByChapterIDSerializer
from chapter_attempt.models import ChapterAttempt
from class_app.models import Class
from class_attempt.models import ClassAttempt
from lesson.models import Lesson
from lesson.serializers import LessonsSerializer, \
    CategoryIDSerializerStart
from lesson_attempt.models import LessonAttempt


class ListLessons(ListAPIView):
    """
    Get all Lessons

    Get all Lessons
    """

    queryset = Lesson.objects.all()
    serializer_class = LessonsSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Lesson'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)



# Security to be review
class UnlockLesson(APIView):
    """
    Create a Lesson and Class Attempt (if needed) by passing the Lesson ID

    Post request
    """

    permission_classes = [IsAuthenticated]


    def get_queryset(self):
        user = self.request.user
        lesson_id = self.kwargs.get('pk')
        if lesson_id:
            chapter_id = Lesson.objects.filter(id=lesson_id).first().chapter.id
            lesson_seq = Lesson.objects.filter(id=lesson_id, chapter=chapter_id).first().sequence
            return LessonAttempt.objects.filter(user=user, lesson__sequence=lesson_seq + 1,  status='completed')
        return Response(False, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(tags=['Lesson'])
    def post(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if queryset.exists():
            user = self.request.user
            lesson_id = self.kwargs.get('pk')
            chapter_id = Lesson.objects.filter(id=lesson_id).first().chapter.id
            class_id = Class.objects.filter(lesson=lesson_id, sequence=1).first().id
            LessonAttempt.objects.get_or_create(user=user, lesson_id=lesson_id, chapter_id=chapter_id)
            ClassAttempt.objects.get_or_create(user=user, related_class_id=class_id)
            return Response(True, status=status.HTTP_201_CREATED)
        else:
            return Response(False, status=status.HTTP_400_BAD_REQUEST)




class LessonUserData(ListAPIView):
    """
    Get User lesson progress by Lesson ID

    Get request
    """

    queryset = Lesson.objects.all()
    serializer_class = ChapterDetailsByChapterIDSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Lesson'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        queryset = self.queryset.filter(id=self.kwargs.get('pk'))
        return queryset




class StartLessonFromCategory(CreateAPIView):

    """
    Start by Category ID

    Post request where a Lesson and Class attempt
    entity will be created and if necessary a Chapter attempt too
    """

    queryset = Category.objects.all()
    serializer_class = CategoryIDSerializerStart
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Lesson'])
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        cat_id = Category.objects.filter(chapter__category_id=request.data.get('category_id')).first()
        chap_attempt = ChapterAttempt.objects.filter(user=request.user,
                                                     chapter=Chapter.objects.filter(category=cat_id, sequence=1).first())

        if cat_id == None:
            return Response({'message':"You cannot start with this ID"},status.HTTP_404_NOT_FOUND)
        elif chap_attempt:
            return Response({'message':"You cannot start this category again "},status.HTTP_400_BAD_REQUEST)
        else:
            chap_cat = Chapter.objects.filter(category=cat_id, sequence=1).first()

            les_cat = Lesson.objects.filter(chapter=chap_cat,sequence=1).first()

            clas_cat = Class.objects.filter(lesson=les_cat, sequence=1).first()

            ChapterAttempt.objects.create(user=request.user,
                                          chapter=chap_cat)
            LessonAttempt.objects.create(user=request.user,
                                         chapter=chap_cat,
                                         lesson=les_cat)
            ClassAttempt.objects.create(user=request.user,
                                        related_class=clas_cat)
            return Response({'message':"You have started a new Module"}, status=status.HTTP_201_CREATED)


class RetrieveUserByID(ListAPIView):

    queryset = Lesson.objects.all()
    serializer_class = LessonsSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Lesson'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        queryset = self.queryset.filter(id=self.kwargs.get('pk'))
        return queryset




