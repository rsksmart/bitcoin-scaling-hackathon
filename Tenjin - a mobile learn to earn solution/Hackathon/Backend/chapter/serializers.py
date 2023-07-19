import numpy as np
from django.contrib.auth import get_user_model
from rest_framework import serializers
from category.models import Category
from chapter.models import Chapter
from chapter_attempt.models import ChapterAttempt
from class_app.models import Class
from class_app.serializers import ClassSerializer, ClassDetailsByChapterIDSerializer
from class_attempt.models import ClassAttempt
from lesson.models import Lesson
from lesson.serializers import LessonsSerializer
from lesson_attempt.models import LessonAttempt
from user_statistic_status.models import UserStatisticStatus

User = get_user_model()

class ChapterSerializer(serializers.ModelSerializer):

    class Meta:
        model = Chapter
        fields = '__all__'



class ChapterDetailsByCategoryIDSerializer(serializers.ModelSerializer):

    status = serializers.SerializerMethodField()

    earned_xp = serializers.SerializerMethodField()

    total_link_class = serializers.SerializerMethodField()

    complete_class = serializers.SerializerMethodField()

    chapter_id = serializers.SerializerMethodField()

    chapter_name = serializers.SerializerMethodField()


    def get_status(self, obj):
        user = self.context

        # Get the latest LessonAttempt for the user and lesson
        lesson_attempt = LessonAttempt.objects.filter(user=user, lesson=obj).order_by('-updated_at').first()

        if lesson_attempt:
            return lesson_attempt.status
        else:
            return 'no-started'

    def get_earned_xp(self, obj):
        xp = LessonAttempt.objects.filter(user=self.context,
                                          lesson=obj.id).all()
        if xp:
            for c in xp:
                return c.collected_xp
        else:
            return 0

    def get_total_link_class(self, obj):
        return Class.objects.filter(lesson=obj.id).count()

    def get_complete_class(self, obj):
        return ClassAttempt.objects.filter(user=self.context,
                                           related_class__lesson=obj.id,
                                           status='completed').count()

    def get_chapter_id(self, obj):
        return obj.chapter.id

    def get_chapter_name(self, obj):
        return obj.chapter.name

    class Meta:
        model = Lesson
        fields = '__all__'


class ChapterDetailsByChapterIDSerializer(serializers.ModelSerializer):

    status = serializers.SerializerMethodField()

    #earned_xp = serializers.SerializerMethodField()

    total_link_class = serializers.SerializerMethodField()

    complete_class = serializers.SerializerMethodField()

    class_data = serializers.SerializerMethodField()

    isStarted = serializers.SerializerMethodField()

    isCompleted = serializers.SerializerMethodField()



    def get_status(self, obj):
        stat= LessonAttempt.objects.filter(user=self.context['request'].user,
                                           lesson=obj.id).first()
        if stat == None:
            return 'no-started'
        else:
            return stat.status


    def get_isStarted(self, obj):
        lessons_status = LessonAttempt.objects.filter(user=self.context['request'].user,
                                                      lesson=obj.id,
                                                      status='no-completed')
        if lessons_status:
            return True
        else:
            return False


    def get_isCompleted(self, obj):
        lessons_status = LessonAttempt.objects.filter(user=self.context['request'].user,
                                                      lesson=obj.id,
                                                      status='completed')
        if lessons_status:
            return True
        else:
            return False



    def get_earned_xp(self, obj):
        xp= LessonAttempt.objects.filter(user=self.context['request'].user,
                                         lesson=obj.id,
                                         status='no-completed').first()
        if xp == None:
            return 0
        else:
            return xp.collected_xp


    def get_total_link_class(self, obj):
        return obj.class_set.filter(lesson=obj.id).count()

    def get_complete_class(self, obj):
        return ClassAttempt.objects.filter(user=self.context['request'].user,
                                           related_class__lesson=obj.id,
                                           status='completed').count()

    def get_class_data(self, obj, *args, **kwargs):
        class_records = Class.objects.filter(lesson=obj).all()
        context = self.context  # Get the context from the serializer

        # Pass the logged-in user to the nested serializer
        context['user'] = self.context['request'].user

        # Create the nested serializer with the updated context
        serializer = ClassDetailsByChapterIDSerializer(class_records, many=True, context=context)

        return serializer.data



    class Meta:
        model = Lesson
        fields = '__all__'


class ChapterWithLessonsSerializer(serializers.ModelSerializer):

    lesson_data = serializers.SerializerMethodField()

    def get_lesson_data(self, obj):
        lesson_records = obj.lesson_set.all()
        return LessonsSerializer(lesson_records, many=True).data

    class Meta:

        model = Chapter
        fields = '__all__'

class ChapterDetailsSerializer(serializers.ModelSerializer):

    category_name = serializers.SerializerMethodField()

    chapter_id = serializers.SerializerMethodField()

    chapter_name = serializers.SerializerMethodField()


    def get_category_name(self, obj):
        cat_id = obj.category.id
        cat_obj = Category.objects.get(id=cat_id)
        return cat_obj.category_name

    def get_chapter_id(self, obj):
        return obj.id

    def get_chapter_name(self, obj):
        return obj.name

    class Meta:
        model = Chapter
        fields = '__all__'


class ChapterStartedSerializer(serializers.ModelSerializer):

    is_started = serializers.SerializerMethodField()

    def get_is_started(self,*args,**kwargs):
        return 'false'

    class Meta:
        model = Chapter
        fields = ['is_started']


class ChapterStartedSerializer2(serializers.ModelSerializer):

    is_started = serializers.SerializerMethodField()

    def get_is_started(self, *args, **kwargs):
        return 'true'

    class Meta:
        model = Chapter
        fields = ['is_started']

class ChapterLessonsByCategoryIDSerializer(serializers.ModelSerializer):


    category_name = serializers.SerializerMethodField()

    chapter_quiz_status = serializers.SerializerMethodField()

    is_chapter_completed = serializers.SerializerMethodField()

    total_classes = serializers.SerializerMethodField()

    classes_completed = serializers.SerializerMethodField()

    check_for_in_between_lesson = serializers.SerializerMethodField()

    check_for_new_lesson = serializers.SerializerMethodField()

    check_for_new_chapter = serializers.SerializerMethodField()

    lesson_data = serializers.SerializerMethodField()

    def get_check_for_in_between_lesson (self, obj):
        user = self.context['request'].user
        lesson_in_chapter = Lesson.objects.filter(chapter_id=obj.id).all()

        current_lesson_attempt = LessonAttempt.objects.filter(
            user=user,
            chapter=obj.id
        ).order_by('-updated_at').first()

        if current_lesson_attempt:
            current_lesson_seq = current_lesson_attempt.lesson.sequence
            for lesson in lesson_in_chapter:
                if current_lesson_seq and lesson.sequence < current_lesson_seq:
                    if not LessonAttempt.objects.filter(user=user, lesson=lesson).exists():
                        related_class = Class.objects.filter(lesson=lesson, sequence=1).only('id').first()
                        if related_class:
                            LessonAttempt.objects.get_or_create(user=user, lesson=lesson, chapter=obj)
                            ClassAttempt.objects.get_or_create(user=user, related_class=related_class)
                            return f'Lesson: {lesson.id} has been started'
                return "No new lesson found"
        return "No new lesson found"


    def get_check_for_new_lesson(self, obj):

        user = self.context['request'].user
        lessons_in_chapter = Lesson.objects.filter(chapter_id=obj.id).count()
        lesson_completed = LessonAttempt.objects.filter(user=user,
                                                        chapter=obj.id,
                                                        status='completed').count()

        if lesson_completed:
            lesson_attempt = LessonAttempt.objects.filter(user=user,
                                                          chapter=obj.id,
                                                          status='no-completed').first()

            if not lesson_attempt and lesson_completed == (lessons_in_chapter -1):
                chapter = obj
                lesson = Lesson.objects.filter(chapter=chapter, sequence=lessons_in_chapter).first()
                class_inst = Class.objects.filter(lesson=lesson, sequence=1).first()
                LessonAttempt.objects.get_or_create(user=user, lesson=lesson, chapter=obj)
                ClassAttempt.objects.get_or_create(user=user, related_class=class_inst)
                return f'Lesson: {lesson.id} has been started'
            return "No new lesson found"
        return "No new lesson found"




    def get_check_for_new_chapter(self, obj):

        user = self.context['request'].user
        chapters_in_module = Chapter.objects.filter(category=obj.category.id).count()
        chapter_completed = ChapterAttempt.objects.filter(user=user,
                                                          chapter__category=obj.category.id,
                                                          status='completed').count()


        if chapter_completed :
            chapter_attempt = ChapterAttempt.objects.filter(user=user,
                                                                  chapter__category=obj.category.id,
                                                                  status='no-completed').first()
            if not chapter_attempt and chapter_completed == (chapters_in_module -1):
                chapter = Chapter.objects.filter(category=obj.category.id, sequence=chapters_in_module).first()
                lesson = Lesson.objects.filter(chapter=chapter, sequence=1).first()
                class_inst = Class.objects.filter(lesson=lesson, sequence=1).first()
                ChapterAttempt.objects.get_or_create(user=user, chapter=chapter)
                LessonAttempt.objects.get_or_create(user=user, chapter=chapter, lesson=lesson)
                ClassAttempt.objects.get_or_create(user=user, related_class=class_inst)
                return f'Chapter: {chapter.id} has been started'
            return "No new chapter found"
        return "No new chapter found"



    def get_category_name(self, obj):
        cat_id = obj.category.id
        cat_obj = Category.objects.get(id=cat_id)
        return cat_obj.category_name


    def get_lesson_data(self, obj):
        lesson_records = obj.lesson_set.all()
        serializer_context=self.context['request'].user
        return ChapterDetailsByCategoryIDSerializer(lesson_records, many=True, context=serializer_context).data


    def get_chapter_quiz_status(self, obj):
        lesson_completed = LessonAttempt.objects.filter(user=self.context['request'].user,
                                                        lesson__chapter_id=obj.id,
                                                        status='completed').count()
        lesson_in_chapter = Lesson.objects.filter(chapter_id=obj.id).count()
        clas_in = Class.objects.filter(lesson__chapter=obj.id)

        if not clas_in:
            return 'locked'
        elif lesson_completed == lesson_in_chapter:
            return 'unlocked'
        else:
            return 'locked'

    def get_is_chapter_completed(self, obj):
        chapter_status = ChapterAttempt.objects.filter(user=self.context['request'].user,
                                                       chapter=obj.id,
                                                       status='completed').first()
        if chapter_status:
            return True
        else:
            return False

    def get_total_classes(self, obj):
        all_classes = Class.objects.filter(lesson__chapter__category_id=obj.category_id)
        total_classes = all_classes.count()
        return total_classes


    def get_classes_completed(self, obj, *args, **kwargs):
        return ClassAttempt.objects.filter(user=self.context['request'].user,
                                           related_class__lesson__chapter=obj.id,
                                           status='completed').count()


    class Meta :

        model = Chapter
        fields = '__all__'





class ChapterLessonsByChapterIDSerializer(serializers.ModelSerializer):

    category_id = serializers.SerializerMethodField()

    category_name = serializers.SerializerMethodField()


    total_classes = serializers.SerializerMethodField()

    classes_completed = serializers.SerializerMethodField()

    lesson_data = serializers.SerializerMethodField()

    isQuizUnlocked = serializers.SerializerMethodField()

    isStarted = serializers.SerializerMethodField()

    isCompleted = serializers.SerializerMethodField()

    status = serializers.SerializerMethodField()



    def get_isQuizUnlocked(self, obj):
        lesson_quiz_status = obj.chapter_related.filter(status='completed')
        if lesson_quiz_status:
            return True
        else:
            return False


    def get_isStarted(self, obj):
        chapter_quiz_status = obj.chapterattempt_set.filter(id=obj.id,
                                                            status='no-completed')
        if chapter_quiz_status:
            return True
        else:
            return False

    def get_isCompleted(self, obj):
        chapter_quiz_status = obj.chapterattempt_set.filter(id=obj.id,
                                                            status='completed')
        if chapter_quiz_status:
            return True
        else:
            return False


    def get_category_id(self, obj):
        cat_id = obj.category.id
        cat_obj = Category.objects.get(id=cat_id)
        return cat_obj.id

    def get_category_name(self, obj):
        cat_id = obj.category.id
        cat_obj = Category.objects.get(id=cat_id)
        return cat_obj.category_name


    def get_lesson_data(self, obj):
        lesson_records = obj.lesson_set.all()
        return ChapterDetailsByChapterIDSerializer(lesson_records, many=True).data

    def get_status(self, obj):
        lessons_status = LessonAttempt.objects.filter(lesson__chapter_id=obj.id).all()
        if lessons_status:
            for c in lessons_status:
                return c.status

        else:
            return 'no-started'

    def get_chapter_quiz_status(self, obj):
        chapter_quiz_status = obj.chapterquizattempt_set.all()
        for c in chapter_quiz_status:
            return c.status

    def get_total_classes(self, obj):
        all_lessons = Lesson.objects.filter(chapter=obj.id)
        all_class = []
        for l in all_lessons:
            all_classes = l.class_set.all()
            all_class.extend(ClassSerializer(all_classes, many=True).data)
        return len(all_class)

    def get_classes_completed(self, obj, *args, **kwargs):
        return ClassAttempt.objects.filter(related_class__lesson__chapter=obj.id,
                                           status='completed').count()


    class Meta :

        model = Chapter
        fields = '__all__'



class ChapterSerializerStart(serializers.ModelSerializer):

    chapter_id = serializers.SerializerMethodField()

    def get_chapter_id(self, obj):
        chap_id = obj.id
        return chap_id

    class Meta:
        model = Chapter
        fields = ['chapter_id']



class ChapterAttemptSerializerComplete(serializers.ModelSerializer):


    class Meta:
        model = ChapterAttempt
        fields = ['chapter']


