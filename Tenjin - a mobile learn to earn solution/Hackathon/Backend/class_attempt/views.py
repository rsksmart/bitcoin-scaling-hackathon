from django.contrib.auth import get_user_model
from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.generics import ListAPIView,UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from category.models import Category
from chapter.models import Chapter
from chapter_attempt.models import ChapterAttempt
from class_app.models import Class
from class_app.serializers import UserClassScoreSerializer, UserClassScoreSerializerNoXp
from class_attempt.models import ClassAttempt
from class_attempt.serializers import ClassAttemptAllSerializer
from lesson.models import Lesson
from lesson_attempt.models import LessonAttempt
from user_statistic_status.models import UserStatisticStatus
User = get_user_model()

class ListClassAttemptAllView(ListAPIView):
    """
    User must be logged-in

    Get the attempted class info for the logged-in user

    """
    queryset = ClassAttempt.objects.all()
    serializer_class = ClassAttemptAllSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Class'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


# Security to be review
class EndClassView(generics.UpdateAPIView):


    """
    User must be logged in, provide a class ID

    Main end of class, with score

    """

    queryset = ClassAttempt.objects.all()
    serializer_class = UserClassScoreSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Class'])
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @swagger_auto_schema(tags=['Class'])
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

    def get_queryset(self):
        queryset1 = self.queryset.filter(user=self.request.user, related_class_id=self.kwargs.get('pk'),
                                         is_first_time=True)

        queryset2 = self.queryset.filter(user=self.request.user, related_class_id=self.kwargs.get('pk'),
                                         is_first_time=False)

        if not queryset1:
            return queryset2
        else:
            return queryset1



    def update(self, request, *args, **kwargs):
        # As a complex endpoint it's a good practice here to declare all of our
        # variable that will be used in this view

        user = self.request.user
        # current class with the ID from our request
        clas_obj = Class.objects.filter(id=self.kwargs.get('pk')).first()
        # related lesson object
        less_obj = Lesson.objects.filter(id=clas_obj.lesson.id).first()
        # related chapter object
        chapt_obj = Chapter.objects.filter(id=less_obj.chapter.id).first()
        # amount of hearts the current user has
        category_obj = Category.objects.filter(id=chapt_obj.category.id).first()
        # If current user has completed the current class
        class_completed = ClassAttempt.objects.filter(user=user,
                                         related_class=clas_obj,
                                         status='completed',
                                         is_first_time=False)

        class_no_completed_jump_off = ClassAttempt.objects.filter(user=user,
                                                      related_class=clas_obj,
                                                      status='no-completed',
                                                      is_first_time=False)

        # if current user first time taking this class
        class_no_completed = ClassAttempt.objects.filter(user=user,
                                         related_class=clas_obj,
                                         status='no-completed')



        # Next Class
        next_class_seq = clas_obj.sequence + 1
        next_class = Class.objects.filter(lesson=clas_obj.lesson,
                                          sequence=next_class_seq).first()


        # Next Lesson
        next_lesson_seq = less_obj.sequence + 1
        next_lesson = Lesson.objects.filter(chapter=chapt_obj,
                                            sequence=next_lesson_seq).first()



        # If user has completed the upcoming lesson
        user_upcoming_lesson_attempt = LessonAttempt.objects.filter(user=user,
                                                                    lesson=next_lesson,
                                                                    chapter=chapt_obj,
                                                                    status='completed')
        # If user has completed the upcoming chapter
        user_current_chapter_attempt = ChapterAttempt.objects.filter(user=user,
                                                                    chapter=chapt_obj,
                                                                    status='completed')
        # Next Chapter
        next_chapter_seq = chapt_obj.sequence + 1
        next_chapter = Chapter.objects.filter(category=category_obj,
                                              sequence=next_chapter_seq).first()



        # how many classe in the last current lesson
        classes_in_less = Class.objects.filter(lesson=less_obj).count()

        # last class in the lesson
        last_class_of_less = Class.objects.filter(sequence=classes_in_less, lesson=less_obj).first().id

        user_class_attempt = ClassAttempt.objects.filter(user=user, related_class=last_class_of_less, is_first_time=True).first()

        if clas_obj:
            if user_upcoming_lesson_attempt and user_class_attempt and last_class_of_less == self.kwargs.get('pk') and next_chapter and user_current_chapter_attempt:

                class_no_completed.update(is_first_time=False,
                                          status='completed')

                LessonAttempt.objects.filter(user=user, lesson=less_obj, chapter=chapt_obj).update(status='completed')

                ChapterAttempt.objects.get_or_create(user=user, chapter=next_chapter)

                first_less = Lesson.objects.filter(chapter=next_chapter, sequence=1).first()
                first_class = Class.objects.filter(lesson=first_less, sequence=1).first()

                LessonAttempt.objects.get_or_create(user=user, lesson=first_less, chapter=next_chapter)
                ClassAttempt.objects.get_or_create(user=user, related_class=first_class)

                queryset = self.get_queryset().first()
                serializer = UserClassScoreSerializer(queryset, context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)


            elif class_no_completed_jump_off:
                # User jumped off while taking a class

                class_no_completed_jump_off.update(status='completed')

                if next_class:
                   # If next class of the current Lesson exist we start a new class
                   ClassAttempt.objects.get_or_create(user=user,
                                                      related_class=next_class)
                   queryset = self.get_queryset().first()
                   serializer = UserClassScoreSerializerNoXp(queryset, context={'request': request})
                   return Response(serializer.data, status=status.HTTP_200_OK)

                else:
                    # If not next class the user has completed all classes in this lesson
                    # so, we start the next lesson and update the current lesson to status completed
                    LessonAttempt.objects.filter(user=user, lesson=less_obj).update(status='completed')

                    if next_lesson:
                        # If next lesson of the current chapter exist we start a new class
                        LessonAttempt.objects.get_or_create(user=user,
                                                     lesson=next_lesson,
                                                     chapter=chapt_obj)
                        first_class_obj = Class.objects.filter(lesson=next_lesson,
                                                               sequence=1).first()
                        ClassAttempt.objects.get_or_create(user=user,
                                                    related_class=first_class_obj)

                        queryset = self.get_queryset().first()
                        serializer = UserClassScoreSerializerNoXp(queryset, context={'request': request})
                        return Response(serializer.data, status=status.HTTP_200_OK)

                    else:
                        # If not next lesson the user has completed all lesson in this chapter
                        # so, we start the next chapter and update the current lesson to status completed
                        class_no_completed.update(is_first_time=False,
                                                  status='completed')

                        LessonAttempt.objects.filter(user=user, lesson=less_obj, chapter=chapt_obj).update(
                            status='completed')


                        ChapterAttempt.objects.filter(user=user, chapter=chapt_obj).update(status='completed')


                        if next_chapter:
                            # If the next chapter exist then we start everything the comes with the chapter
                            ChapterAttempt.objects.get_or_create(user=user, chapter=next_chapter)

                            first_less = Lesson.objects.filter(chapter=next_chapter, sequence=1).first()
                            first_class = Class.objects.filter(lesson=first_less, sequence=1).first()

                            LessonAttempt.objects.get_or_create(user=user, lesson=first_less, chapter=next_chapter)
                            ClassAttempt.objects.get_or_create(user=user,related_class=first_class)

                            queryset = self.get_queryset().first()
                            serializer = UserClassScoreSerializerNoXp(queryset, context={'request': request})
                            return Response(serializer.data, status=status.HTTP_200_OK)
                        else:
                            # Here it means that the user has completed all the chapters in that module
                            queryset = self.get_queryset().first()
                            serializer = UserClassScoreSerializerNoXp(queryset, context={'request': request})
                            return Response(serializer.data, status=status.HTTP_200_OK)



            elif class_completed:
                # User has completed a class NOT the first time
                queryset = self.get_queryset().first()
                serializer = UserClassScoreSerializerNoXp(queryset, context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)

            elif class_no_completed:
                # User has completed a class for the first time, so we update the status
                # of current class_attempt.
                class_no_completed.update(is_first_time=False,
                                          status='completed')

                if next_class:

                   # If next class of the current Lesson exist we start a new class
                   ClassAttempt.objects.get_or_create(user=user,
                                               related_class=next_class)
                   queryset = self.get_queryset().first()

                   serializer = UserClassScoreSerializer(queryset, context={'request': request})
                   return Response(serializer.data, status=status.HTTP_200_OK)
                else:
                    # If not next class the user has completed all classes in this lesson
                    # so, we start the next lesson and update the current lesson to status completed
                    LessonAttempt.objects.filter(user=user, lesson=less_obj).update(status='completed')

                    if next_lesson:
                        # If next lesson of the current chapter exist we start a new class
                        LessonAttempt.objects.get_or_create(user=user,
                                                     lesson=next_lesson,
                                                     chapter=chapt_obj)
                        first_class_obj = Class.objects.filter(lesson=next_lesson,
                                                               sequence=1).first()
                        ClassAttempt.objects.get_or_create(user=user,
                                                    related_class=first_class_obj)

                        queryset = self.get_queryset().first()

                        serializer = UserClassScoreSerializer(queryset, context={'request': request})
                        return Response(serializer.data, status=status.HTTP_200_OK)

                    else:
                        # If not next lesson the user has completed all lesson in this chapter
                        # so, we start the next chapter and update the current lesson to status completed
                        class_no_completed.update(is_first_time=False,
                                                  status='completed')

                        LessonAttempt.objects.filter(user=user, lesson=less_obj, chapter=chapt_obj).update(
                            status='completed')


                        ChapterAttempt.objects.filter(user=user, chapter=chapt_obj).update(status='completed')


                        if next_chapter:
                            # If the next chapter exist then we start everything the comes with the chapter
                            ChapterAttempt.objects.get_or_create(user=user, chapter=next_chapter)

                            first_less = Lesson.objects.filter(chapter=next_chapter, sequence=1).first()
                            first_class = Class.objects.filter(lesson=first_less, sequence=1).first()

                            LessonAttempt.objects.get_or_create(user=user, lesson=first_less, chapter=next_chapter)
                            ClassAttempt.objects.get_or_create(user=user,related_class=first_class)

                            queryset = self.get_queryset().first()
                            serializer = UserClassScoreSerializer(queryset, context={'request': request})
                            return Response(serializer.data, status=status.HTTP_200_OK)
                        else:
                            # Here it means that the user has completed all the chapters in that module
                            queryset = self.get_queryset().first()
                            serializer = UserClassScoreSerializer(queryset, context={'request': request})
                            return Response(serializer.data, status=status.HTTP_200_OK)
















