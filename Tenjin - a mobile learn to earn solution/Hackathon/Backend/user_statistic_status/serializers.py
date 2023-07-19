from decimal import Decimal

from rest_framework import serializers
from category.models import Category
from chapter.models import Chapter
from chapter_attempt.models import ChapterAttempt
from class_attempt.models import ClassAttempt
from class_app.models import Class
from lesson.models import Lesson
from lesson_attempt.models import LessonAttempt
# from project.settings import CLOUDFRONT_DOMAIN
from .models import UserStatisticStatus, UserLeaderboardTracking
from django.contrib.auth import get_user_model
from class_app.serializers import ClassImageSerializer




User = get_user_model()



class RBTCSerializerField(serializers.DecimalField):
    def to_representation(self, value):
        translated_value = value * Decimal('10') ** 18
        return str(translated_value)


class UserStatisticsStatusSerializer(serializers.ModelSerializer):

    level_percentage = serializers.SerializerMethodField()

    RBTC = RBTCSerializerField(max_digits=20, decimal_places=18)


    def get_level_percentage(self, request, *args, **kwargs):

        tot_xp = UserStatisticStatus.objects.filter(user=self.context['request'].user)[0].total_xp

        if tot_xp <= 700:
            float= (tot_xp / 700) * 100
            return "{:.2f}".format(float)

        elif (tot_xp > 700) and (tot_xp <= 2000):
            starting_point= tot_xp - 700
            float = (starting_point / 1300) * 100
            return "{:.2f}".format(float)

        elif (tot_xp > 2000) and (tot_xp <= 4000):
            starting_point = tot_xp - 2000
            float = (starting_point / 2000) * 100
            return "{:.2f}".format(float)

        elif (tot_xp > 4000) and (tot_xp <= 7000):
            starting_point = tot_xp - 4000
            float = (starting_point / 3000) * 100
            return "{:.2f}".format(float)

        elif (tot_xp > 7000) and (tot_xp <= 11000):
            starting_point = tot_xp - 7000
            float = (starting_point / 4000) * 100
            return "{:.2f}".format(float)

        elif (tot_xp > 11000) and (tot_xp <= 16000):
            starting_point = tot_xp - 11000
            float = (starting_point / 5000) * 100
            return "{:.2f}".format(float)

        elif (tot_xp > 16000) and (tot_xp <= 22000):
            starting_point = tot_xp - 16000
            float = (starting_point / 6000) * 100
            return "{:.2f}".format(float)

        elif (tot_xp > 22000) and (tot_xp <= 37000):
            starting_point = tot_xp - 22000
            float = (starting_point / 15000) * 100
            return "{:.2f}".format(float)

        elif (tot_xp > 37000) and (tot_xp <= 46000):
            starting_point = tot_xp - 37000
            float = (starting_point / 9000) * 100
            return "{:.2f}".format(float)

        elif (tot_xp > 46000):
            return 100.00

    class Meta:
        model = UserStatisticStatus
        fields = '__all__'



class UpdateUserXPSerializer(serializers.ModelSerializer):


    class Meta:
        model = UserStatisticStatus
        fields = ['total_xp']



class UpdateUserSatsSerializer(serializers.ModelSerializer):


    class Meta:
        model = UserStatisticStatus
        fields = ['total_sats']



class UpdateUserSatisticSerializer(serializers.ModelSerializer):


    class Meta:
        model = UserStatisticStatus
        fields = '__all__'
        read_only = ['total_xp', 'day_streak','total_sats', 'heart', 'level','day_streak']


class UserRBTCSerializer(serializers.ModelSerializer):

    RBTC_amount = serializers.SerializerMethodField()


    def get_RBTC_amount(self, obj):

        user_obj = UserStatisticStatus.objects.filter(id=obj.id)

        return user_obj.first().RBTC

    class Meta:
        model = User
        fields = ['id','username', 'RBTC_amount', 'wallet_address']




class UserLeaderboardSerializer(serializers.ModelSerializer):

    id = serializers.SerializerMethodField()

    avatar = serializers.SerializerMethodField()

    user = serializers.SerializerMethodField()

    xp = serializers.SerializerMethodField()


    def get_id(self,obj):
        return obj['user_id']

    def get_avatar(self, obj):
        us_id = obj['user_id']
        user_det = User.objects.filter(id=us_id).first()
        if user_det.avatar:
            return user_det.avatar.url
        return None

    def get_xp(self, obj):
        return obj['xp_val']

    def get_user(self, obj):
        us_id = obj['user_id']
        user_det = User.objects.filter(id=us_id)[0]
        return user_det.username

    class Meta:
        model = UserLeaderboardTracking
        fields = ['id', 'user', 'xp', 'avatar']



class UserLeaderboardGlobalSerializer(serializers.ModelSerializer):

    id = serializers.SerializerMethodField()

    # avatar = serializers.SerializerMethodField()

    user = serializers.SerializerMethodField()

    xp = serializers.SerializerMethodField()

    day_streak = serializers.SerializerMethodField()



    def get_id(self,obj):
        return obj['user_id']

    # def get_avatar(self, obj, *args, **kwargs):
    #     us_id = obj['user']
    #     user_det = User.objects.filter(id=us_id)[0]
    #     if user_det.avatar:
    #         return f"https://{CLOUDFRONT_DOMAIN}/{user_det.avatar.name}"
    #     return None


    def get_day_streak(self, obj):
        us_id = obj['user']
        user_det = UserStatisticStatus.objects.filter(user=us_id)[0].day_streak
        return user_det


    def get_xp(self, obj):
        return obj['xp_val']


    def get_user(self, obj):
        us_id = obj['user']
        user_det = User.objects.filter(id=us_id)[0].username
        return user_det

    class Meta:
        model = UserLeaderboardTracking
        fields = ['id', 'user', 'xp', 'day_streak']
        read_only_fields = ['xp', 'day_streak']


class UserMyStatusWithProgress2(serializers.ModelSerializer):

    user = serializers.SerializerMethodField()

    total_xp = serializers.SerializerMethodField()

    total_sats = serializers.SerializerMethodField()

    heart = serializers.SerializerMethodField()

    day_streak = serializers.SerializerMethodField()

    next_chapter_id = serializers.SerializerMethodField()

    next_chapter = serializers.SerializerMethodField()

    next_chapter_sequence = serializers.SerializerMethodField()

    chapter_quiz_unlocked = serializers.SerializerMethodField()

    next_block_id = serializers.SerializerMethodField()

    next_block = serializers.SerializerMethodField()

    next_block_sequence = serializers.SerializerMethodField()

    next_class_id = serializers.SerializerMethodField()

    next_class = serializers.SerializerMethodField()

    next_class_sequence = serializers.SerializerMethodField()

    level = serializers.SerializerMethodField()

    level_percentage = serializers.SerializerMethodField()

    category_started = serializers.SerializerMethodField()

    #category_text = serializers.SerializerMethodField()

    #category_description = serializers.SerializerMethodField()


    def get_user(self, request, *args, **kwargs):

        return UserStatisticStatus.objects.filter(user=self.context['request'].user)[0].user.username

    def get_total_xp(self, request, *args, **kwargs):

        return UserStatisticStatus.objects.filter(user=self.context['request'].user)[0].total_xp

    def get_total_sats(self, request, *args, **kwargs):

        return UserStatisticStatus.objects.filter(user=self.context['request'].user)[0].total_sats



    def get_heart(self, request, *args, **kwargs):

        return UserStatisticStatus.objects.filter(user=self.context['request'].user)[0].heart

    def get_day_streak(self, request, *args, **kwargs):

        return UserStatisticStatus.objects.filter(user=self.context['request'].user)[0].day_streak

    def get_next_chapter_id(self, obj):

        current_chapter = ChapterAttempt.objects.filter(chapter__category=obj,
                                                        user=self.context['request'].user,
                                                        status='no-completed')

        if current_chapter:
            return current_chapter[0].chapter.id
        else:
            return Chapter.objects.filter(category=obj,
                                          sequence=1)[0].id


    def get_next_chapter(self, obj):

        current_chapter = ChapterAttempt.objects.filter(chapter__category=obj,
                                                        user=self.context['request'].user,
                                                        status='no-completed')

        if current_chapter:
            return current_chapter[0].chapter.name
        else:
            return Chapter.objects.filter(category=obj,
                                          sequence=1)[0].name

    def get_chapter_quiz_unlocked(self, obj):
        lesson_completed = LessonAttempt.objects.filter(user=self.context['request'].user,
                                                        lesson__chapter__category=obj.id,
                                                        status='completed').count()
        lesson_in_chapter = Lesson.objects.filter(chapter__category=obj.id).count()
        if lesson_completed == lesson_in_chapter:
            return 'unlocked'
        else:
            return 'locked'



    def get_next_chapter_sequence(self, obj):

        current_chapter = ChapterAttempt.objects.filter(chapter__category=obj,
                                                        user=self.context['request'].user,
                                                        status='no-completed')
        if current_chapter:
            return current_chapter[0].chapter.sequence
        else:
            return Chapter.objects.filter(category=obj, sequence=1)[0].sequence

    def get_next_block_id(self, obj):

        current_block = LessonAttempt.objects.filter(lesson__chapter__category=obj,
                                                     user=self.context['request'].user,
                                                     status='no-completed')

        if current_block:
            return current_block[0].lesson.id
        else:
            return Lesson.objects.filter(chapter__category=obj,
                                         sequence=1)[0].id


    def get_next_block(self, obj):

        current_block = LessonAttempt.objects.filter(lesson__chapter__category=obj,
                                                     user=self.context['request'].user,
                                                     status='no-completed')

        if current_block:
            return current_block[0].lesson.title
        else:
            return Lesson.objects.filter(chapter__category=obj,
                                         sequence=1)[0].title


    def get_next_block_sequence(self, obj):

        current_block = LessonAttempt.objects.filter(lesson__chapter__category=obj,
                                                     user=self.context['request'].user,
                                                     status='no-completed')

        if current_block:
            return current_block[0].lesson.sequence
        else:
            return Lesson.objects.filter(chapter__category=obj,
                                         sequence=1)[0].sequence


    def get_next_class_id(self, obj):

        current_class = ClassAttempt.objects.filter(related_class__lesson__chapter__category=obj,
                                                    user=self.context['request'].user,
                                                    status='no-completed')

        if current_class:
            return current_class[0].related_class.id
        else:
            return Class.objects.filter(lesson__chapter__category=obj,
                                        sequence=1)[0].id

    def get_next_class(self, obj):

        current_class = ClassAttempt.objects.filter(related_class__lesson__chapter__category=obj,
                                                    user=self.context['request'].user,
                                                    status='no-completed')

        if current_class:
            return current_class[0].related_class.title
        else:
            return Class.objects.filter(lesson__chapter__category=obj,
                                        sequence=1)[0].title


    def get_next_class_sequence(self, obj):

        current_class = ClassAttempt.objects.filter(related_class__lesson__chapter__category=obj,
                                                    user=self.context['request'].user,
                                                    status='no-completed')

        if current_class:
            return current_class[0].related_class.sequence
        else:
            return Class.objects.filter(lesson__chapter__category=obj,
                                        sequence=1)[0].sequence

    def get_level(self,*args, **kwargs):

        user_lev = UserStatisticStatus.objects.filter(user=self.context['request'].user)[0].level
        return user_lev



    def get_level_percentage(self, request, *args, **kwargs):

        tot_xp = UserStatisticStatus.objects.filter(user=self.context['request'].user)[0].total_xp

        if tot_xp <= 700:
            float= (tot_xp / 700) * 100
            return "{:.2f}".format(float)

        elif (tot_xp > 700) and (tot_xp <= 2000):
            starting_point= tot_xp - 700
            float = (starting_point / 1300) * 100
            return "{:.2f}".format(float)

        elif (tot_xp > 2000) and (tot_xp <= 4000):
            starting_point = tot_xp - 2000
            float = (starting_point / 2000) * 100
            return "{:.2f}".format(float)

        elif (tot_xp > 4000) and (tot_xp <= 7000):
            starting_point = tot_xp - 4000
            float = (starting_point / 3000) * 100
            return "{:.2f}".format(float)

        elif (tot_xp > 7000) and (tot_xp <= 11000):
            starting_point = tot_xp - 7000
            float = (starting_point / 4000) * 100
            return "{:.2f}".format(float)

        elif (tot_xp > 11000) and (tot_xp <= 16000):
            starting_point = tot_xp - 11000
            float = (starting_point / 5000) * 100
            return "{:.2f}".format(float)

        elif (tot_xp > 16000) and (tot_xp <= 22000):
            starting_point = tot_xp - 16000
            float = (starting_point / 6000) * 100
            return "{:.2f}".format(float)

        elif (tot_xp > 22000) and (tot_xp <= 37000):
            starting_point = tot_xp - 22000
            float = (starting_point / 15000) * 100
            return "{:.2f}".format(float)

        elif (tot_xp > 37000) and (tot_xp <= 46000):
            starting_point = tot_xp - 37000
            float = (starting_point / 9000) * 100
            return "{:.2f}".format(float)

        elif (tot_xp > 46000):
            return 100.00

    def get_category_started(self,obj):
        data = ChapterAttempt.objects.filter(user=self.context['request'].user,
                                             chapter__category__id=obj.id).first()
        if data:
            return True
        return False

    def get_category_text(self,obj):
         data = Category.objects.filter(id=obj.id).first()
         return data.text


    def get_category_description(self, obj, *args, **kwargs):
        cat_id = obj.id
        cat_obj = Category.objects.filter(id=cat_id).first()
        if cat_obj.description:
            return cat_obj.description.url
        return None


    class Meta:
        model = UserStatisticStatus
        fields = ["user", "level", "level_percentage", "total_xp", "total_sats", "heart",\
                   "day_streak","next_chapter_id", "next_chapter",\
                  "next_chapter_sequence", "chapter_quiz_unlocked", "next_block_id", "next_block", "next_block_sequence",\
                  "next_class_id", "next_class","next_class_sequence", "category_started"]




class UserMyStatusWithProgressDownload(serializers.ModelSerializer):

    current_lesson_images = serializers.SerializerMethodField()

    next_lesson_images = serializers.SerializerMethodField()

    category_name = serializers.SerializerMethodField()

    category_id = serializers.SerializerMethodField()

    category_sequence = serializers.SerializerMethodField()

    def get_category_name(self, obj):
        return obj.category_name

    def get_category_id(self, obj):
        return obj.pk

    def get_category_sequence(self, obj):
        return obj.sequence

    def get_current_lesson_images(self, obj):

        current_block = LessonAttempt.objects.filter(lesson__chapter__category=obj,
                                                     user=self.context['request'].user,
                                                     status='no-completed')
        if current_block:
            current_class = Class.objects.filter(lesson=current_block[0].lesson)
            serializer = ClassImageSerializer(current_class, many=True)
            return serializer.data

        else:
            current_block = Lesson.objects.filter(chapter__category=obj, sequence=1)
            if current_block:
                current_class = Class.objects.filter(lesson=current_block[0].id)
                serializer = ClassImageSerializer(current_class, many=True)
                return serializer.data
            else:
                return None


    def get_next_lesson_images(self, obj):
        current_lesson = LessonAttempt.objects.filter(lesson__chapter__category=obj,
                                                     user=self.context['request'].user,
                                                     status='no-completed')

        if current_lesson:
            next_classes = Class.objects.filter(lesson__sequence=current_lesson[0].lesson.sequence + 1,
                                                lesson__chapter=current_lesson[0].lesson.chapter)

            if next_classes:
                serializer = ClassImageSerializer(next_classes, many=True)
                return serializer.data
            else:
                serializer = ClassImageSerializer(Class.objects.filter(lesson__chapter__category=obj,
                                                                       lesson__chapter__sequence=current_lesson[
                                                                           0].lesson.chapter.sequence + 1,
                                                                       ), many=True)
                return serializer.data

        else:
            current_block = Lesson.objects.filter(chapter__category=obj, sequence=2)
            current_class = Class.objects.filter(lesson=current_block[0].id)
            serializer = ClassImageSerializer(current_class, many=True)
            return serializer.data


    class Meta:
        model = Category
        fields = ["current_lesson_images", "next_lesson_images", "category_name",
                  "category_id", "category_sequence"]
