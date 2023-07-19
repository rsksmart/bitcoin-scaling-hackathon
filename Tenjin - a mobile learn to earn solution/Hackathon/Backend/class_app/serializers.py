from django.contrib.auth import get_user_model
from rest_framework import serializers
from class_attempt.models import ClassAttempt
from class_quiz.models import ClassQuiz
from quiz_answer_class.models import QuizAnsClass
from quiz_answer_class.serializers import QuizAnswerOptionsSerializer
from class_app.models import Class
from user_class_question_record.models import UserClassQuestionsRecord
from user_statistic_status.models import UserStatisticStatus
import numpy as np

User = get_user_model()


class ClassSerializer(serializers.ModelSerializer):


    class Meta:
        model = Class
        fields = '__all__'


class StartClassSerializer(serializers.ModelSerializer):

    class Meta:
        model = Class
        fields = ['id']


class UserClassScoreSerializer2(serializers.ModelSerializer):

    score = serializers.SerializerMethodField()

    xp_collected = serializers.SerializerMethodField()

    def get_score(self, obj):

        class_data = UserClassQuestionsRecord.objects.filter(user=self.context['request'].user, question__singleclass_id=obj.id, is_correct='True').all()

        return class_data.__len__()

    def get_xp_collected(self, obj):

        class_data = UserClassQuestionsRecord.objects.filter(user=self.context['request'].user, question__singleclass_id=obj.id, is_correct='True').all()

        obj_count = class_data.__len__()

        return obj_count * 10


    class Meta:
        model = Class
        fields = ['score', 'xp_collected']




class UserClassScoreSerializer(serializers.ModelSerializer):

    score = serializers.SerializerMethodField()

    xp_collected = serializers.SerializerMethodField()

    loot_box = serializers.SerializerMethodField()



    def get_score(self, obj):

        class_data = UserClassQuestionsRecord.objects.filter(user=self.context['request'].user,
                                                             question__singleclass_id=obj.related_class.id,
                                                             ).order_by('-created_at').all()[:3]

        return len([c for c in class_data if c.is_correct == 'True'])

    def get_xp_collected(self, obj):

        class_data = UserClassQuestionsRecord.objects.filter(user=self.context['request'].user,
                                                             question__singleclass_id=obj.related_class.id,
                                                             ).order_by('-created_at').all()[:3]

        return len([c for c in class_data if c.is_correct == 'True']) * 10


    def get_loot_box(self, obj):

        user_status = UserStatisticStatus.objects.filter(user=self.context['request'].user)
        user_balance = UserStatisticStatus.objects.filter(user=self.context['request'].user).first().RBTC

        class_data = UserClassQuestionsRecord.objects.filter(user=self.context['request'].user,
                                                             question__singleclass_id=obj.related_class.id,
                                                             ).order_by('-created_at').all()[:3]


        score = len([c for c in class_data if c.is_correct == 'True'])

        if score == 3:
            tokens = int(np.random.normal(10, 5))
            tokens = min(max(1, tokens), 50)
            user_status.update(RBTC=user_balance + tokens)
            loot_box = {'RBTC': tokens}
            return loot_box
        return None

    class Meta:
        model = Class
        fields = ['score', 'xp_collected', 'loot_box']


class UserClassScoreSerializerNoXp(serializers.ModelSerializer):

    score = serializers.SerializerMethodField()

    xp_collected = serializers.SerializerMethodField()

    loot_box = serializers.SerializerMethodField()



    def get_score(self, obj):
        class_data = UserClassQuestionsRecord.objects.filter(user=self.context['request'].user,
                                                             question__singleclass_id=obj.related_class.id,
                                                             ).order_by('-created_at').all()[:3]

        return len([c for c in class_data if c.is_correct == 'True'])

    def get_xp_collected(self, obj, *args,  **kwargs):
        return 0


    def get_loot_box(self, obj):
        return None



    class Meta:
        model = Class
        fields = ['score', 'xp_collected', 'loot_box']



class LessonsClassesSerializer(serializers.ModelSerializer):


    question_list = serializers.SerializerMethodField()

    is_first_attempt = serializers.SerializerMethodField()

    def get_question_list(self, obj):
        quest = obj.single_quiz.filter(singleclass_id=obj.id)
        return ClassQuestionSerializer(quest, many=True).data


    def get_is_first_attempt(self, obj):
        att = ClassAttempt.objects.filter(user=self.context['request'].user,
                                          related_class_id=obj.id,
                                          is_first_time='True').first()

        if not att:
            return False
        return True


    class Meta:
        model = Class
        fields = ['id', 'is_first_attempt', 'question_list']


class ClassQuestionSerializer(serializers.ModelSerializer):

    options = serializers.SerializerMethodField()


    def get_options(self, obj):
        clQuiz = QuizAnsClass.objects.filter(quiz_id=obj.id)
        return QuizAnswerOptionsSerializer(clQuiz, many=True).data

    class Meta:
        model = ClassQuiz
        fields = ['id', 'question_name','explanation','options']


class ClassDetailsByChapterIDSerializer(serializers.ModelSerializer):

    is_completed = serializers.SerializerMethodField()

    is_started = serializers.SerializerMethodField()

    def get_is_completed(self, obj):
        user = self.context['user']
        data = ClassAttempt.objects.filter(user=user, related_class=obj, status='completed').first()
        if data:
            return True
        return False

    def get_is_started(self, obj):
        user = self.context['user']
        data = ClassAttempt.objects.filter(user=user, related_class=obj, status='no-completed').first()
        if data:
            return True
        return False


    class Meta:
        model = Class
        fields = '__all__'

class ClassImageSerializer(serializers.ModelSerializer):


    class Meta:
        model = Class
        fields = ['id', 'sequence']

