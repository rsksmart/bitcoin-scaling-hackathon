from category.models import Category
from class_app.serializers import ClassSerializer
from lesson.models import Lesson
from lesson_attempt.models import LessonAttempt
from rest_framework import serializers
from class_attempt.models import ClassAttempt


class LessonAttemptsSerializer(serializers.ModelSerializer):

    category_id = serializers.SerializerMethodField()

    category_name = serializers.SerializerMethodField()

    lessons_completed = serializers.SerializerMethodField()

    total_lessons = serializers.SerializerMethodField()

    total_classes = serializers.SerializerMethodField()

    classes_completed = serializers.SerializerMethodField()



    def get_category_id(self, obj):
        cat_id = obj.chapter.category.id
        cat_obj = Category.objects.get(id=cat_id)
        return cat_obj.id

    def get_category_name(self, obj):
        cat_id = obj.chapter.category.id
        cat_obj = Category.objects.get(id=cat_id)
        return cat_obj.category_name

    def get_lessons_completed(self, obj, *args, **kwargs):
        return LessonAttempt.objects.filter(user=obj.user, status='completed').count()


    def get_total_lessons(self, obj):
        tot_less = Lesson.objects.filter(chapter__category_id=obj.chapter.category_id)
        return tot_less.count()


    def get_total_classes(self, obj):
        all_lessons = Lesson.objects.filter(chapter__category_id=obj.chapter.category_id)
        all_class = []
        for l in all_lessons:
            all_classes = l.class_set.all()
            all_class.extend(ClassSerializer(all_classes, many=True).data)
        return len(all_class)

    def get_classes_completed(self, obj, *args, **kwargs):
        return ClassAttempt.objects.filter(user=obj.user, status='completed').count()

    class Meta:
        model = LessonAttempt
        fields = ('category_id', 'category_name','total_lessons', 'lessons_completed', 'total_classes', 'classes_completed')


class LessonAttemptStatusSerializer(serializers.ModelSerializer):

    lessons_in_progress = serializers.SerializerMethodField()


    def get_lessons_in_progress(self,obj):

        if obj:
            id = obj.lesson.id
            cl_att = ClassAttempt.objects.filter(related_class__lesson_id=id)[0].related_class.title
            title = obj.lesson.title
            cat_id = obj.chapter.category_id
            cat_name = obj.chapter.category.category_name
            ch_id = obj.chapter.id
            ch_name = obj.chapter.name

            return [{
                     "category_id": cat_id,
                     "category_name": cat_name,
                     "block_name":title,
                     "block_id": id,
                     "chapter_id":ch_id,
                     "chapter_name":ch_name,
                     "isNotStarted":False,
                     "next_class":cl_att
            }]

    class Meta:
        model = LessonAttempt
        fields = ['lessons_in_progress']