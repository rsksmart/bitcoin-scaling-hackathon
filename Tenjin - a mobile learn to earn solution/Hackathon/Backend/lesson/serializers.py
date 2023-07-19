from rest_framework import serializers
from class_app.models import  Class
from class_app.serializers import ClassSerializer, ClassDetailsByChapterIDSerializer
from lesson.models import Lesson

from lesson_attempt.models import LessonAttempt


class LessonsSerializer(serializers.ModelSerializer):

    is_completed = serializers.SerializerMethodField()

    is_started = serializers.SerializerMethodField()

    classes = serializers.SerializerMethodField()

    def get_is_started(self, obj):
        less_att = obj.lessons_related.filter(user=self.context['request'].user,status='no-completed')
        if less_att:
            return True
        else:
            return False

    def get_is_completed(self, obj):
        less_att = obj.lessons_related.filter(user=self.context['request'].user, status='completed')
        if less_att:
            return True
        else:
            return False

    def get_classes(self, obj, *args, **kwargs):
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





class LessonsSerializerStart(serializers.ModelSerializer):

    lesson_id = serializers.SerializerMethodField()

    def get_lesson_id(self, obj):
        les_id = obj.id
        return les_id

    class Meta:
        model = Lesson
        fields = ['lesson_id']



class CategoryIDSerializerStart(serializers.ModelSerializer):

    category_id = serializers.SerializerMethodField()

    def get_category_id(self, obj):
        cat_id = obj.id
        return cat_id

    class Meta:
        model = Lesson
        fields = ['category_id']



class LessonsAttemptSerializerComplete(serializers.ModelSerializer):


    class Meta:
        model = LessonAttempt
        fields = ['lesson']




