from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from category.models import Category
from chapter.models import Chapter
from chapter.serializers import ChapterSerializer, ChapterWithLessonsSerializer, ChapterLessonsByCategoryIDSerializer, \
    ChapterLessonsByChapterIDSerializer, ChapterDetailsSerializer, ChapterSerializerStart, \
 ChapterStartedSerializer, ChapterStartedSerializer2
from chapter_attempt.models import ChapterAttempt
from class_app.models import Class
from class_attempt.models import ClassAttempt
from lesson.models import Lesson
from lesson_attempt.models import LessonAttempt
from lesson_attempt.serializers import LessonAttemptsSerializer



class ListChapters(ListAPIView):

    """
    Get all Chapter instances

    Get all Chapter instances
    """
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Chapter'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

class RetrieveChapterProgressByIDAPIView(ListAPIView):

    """
    Pass a Category ID
    Get Total lessons and Classes and how many are completed in this Category
    """

    queryset = LessonAttempt.objects.all()
    serializer_class = LessonAttemptsSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Chapter'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        queryset = self.queryset.filter(chapter__category__id=self.kwargs.get('pk'))
        return queryset


    def list(self, request, *args, **kwargs):
        if not self.get_queryset():
            try:
                get_total_lessons = 0
                all_classes = 0
                cat_id = self.kwargs.get('pk')
                cat_obj = Category.objects.filter(id=self.kwargs.get('pk')).last()
                if not cat_obj:
                    return Response(status=status.HTTP_404_NOT_FOUND)
                cat_obj = cat_obj.category_name
                get_total_lessons = Lesson.objects.filter(chapter__category_id=cat_id).count()
                get_lessons = Lesson.objects.filter(chapter__category_id=cat_id)

                for l in get_lessons:
                    all_classes += l.class_set.all().count()

            except:
                #cat_obj = "With this id Category object does not exist"
                get_total_lessons = get_total_lessons
                all_classes = all_classes

            default_dict = {
                    "category_id": self.kwargs.get('pk'),
                    "category_name": cat_obj,
                    "total_lessons": get_total_lessons,
                    "lessons_completed": 0,
                    "total_classes": all_classes,
                    "classes_completed": 0
                }
            return Response(default_dict)
        else:
            return super().list(request, *args, **kwargs)




class ListChapterLessonsByCategoryIDAPIView(ListAPIView):

    """
    Provide the Category ID

    Get a detailed look at all Chapters and Lessons(Blocks) in the specific Category

    """
    queryset = Chapter.objects.all()
    serializer_class = ChapterLessonsByCategoryIDSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Chapter'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        return self.queryset.filter(category__id=self.kwargs.get('pk'))


    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        if response.data:
            return response
        return Response(status=status.HTTP_404_NOT_FOUND)

class ListChapterDetailsByCategoryIDAPIView(ListAPIView):

    """
    Provide a Category ID

    Get details (Chapters) included in a Category by the Category ID

    """
    queryset = Chapter.objects.all()
    serializer_class = ChapterDetailsSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Chapter'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        return self.queryset.filter(category__id=self.kwargs.get('pk'))


    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        if response.data:
            return response
        return Response(status=status.HTTP_404_NOT_FOUND)



class CategoryStartedAPIView(ListAPIView):

    """
    User must be logged-in in order to get the started status of his Chapters

    Get the status (is_started= true || false) of each Chapter in a given Category by ID
    """
    queryset = ChapterAttempt.objects.all()
    serializer_class = ChapterStartedSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Chapter'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_serializer_class(self):
        queryset = self.queryset.filter(user=self.request.user,chapter__category__id=self.kwargs.get('pk')).first()
        if not queryset:
            return ChapterStartedSerializer

        else:
            return ChapterStartedSerializer2



class ListChapterLessonsByChapterIDAPIView(ListAPIView):

    queryset = Chapter.objects.all()
    serializer_class = ChapterLessonsByChapterIDSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = self.queryset.filter(id=self.kwargs.get('pk'))
        return queryset

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        if response.data:
            return response
        return Response(response.data)


class StartChapter(CreateAPIView):
    """
    Start a Chapter by ID

    Post request where a Chapter attempt
    entity will be created
    """

    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializerStart
    permission_classes = [IsAdminUser]

    @swagger_auto_schema(tags=['Chapter'])
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


    def create(self, request, *args, **kwargs):
        chapter = Chapter.objects.filter(id=request.data.get('chapter_id')).last()
        lesson = Lesson.objects.filter(chapter=chapter, sequence=1).last()
        cl = Class.objects.filter(lesson=lesson, sequence=1).last()

        if chapter == None:
            return Response({'message':"Chapter cannot be started with this ID"},status.HTTP_404_NOT_FOUND)
        elif ChapterAttempt.objects.filter(user=request.user,
                                           chapter=chapter,
                                           status='no-completed'):
            return Response({'message': "Chapter was already started"}, status.HTTP_400_BAD_REQUEST)
        else:
            ChapterAttempt.objects.create(user=request.user,
                                          chapter=chapter)
            LessonAttempt.objects.create(user=request.user,
                                         chapter=chapter,
                                         lesson=lesson)
            ClassAttempt.objects.create(user=request.user,
                                        related_class=cl)
            return Response({'message':"You have started a new chapter"}, status=status.HTTP_201_CREATED)




class ListChaptersWithLessons(ListAPIView):

    """
    Get all Chapters including Lessons (Blocks)

    Get all Chapters, for each Chapter get all lessons (Blocks) associated with that Chapter

    """

    queryset = Chapter.objects.all()
    serializer_class = ChapterWithLessonsSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Chapter'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)





