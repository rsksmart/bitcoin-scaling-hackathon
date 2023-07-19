from class_attempt.models import ClassAttempt
from rest_framework import serializers
from user_class_question_record.models import UserClassQuestionsRecord


class ClassAttemptSerializer(serializers.ModelSerializer):

    question_id = serializers.SerializerMethodField()

    selected_answerId = serializers.SerializerMethodField()

    user_id = serializers.SerializerMethodField()

    is_correct = serializers.SerializerMethodField()

    xp_collected = serializers.SerializerMethodField()

    #selected_option = serializers.SerializerMethodField()

    date_attempt = serializers.SerializerMethodField()

    def get_question_id(self, obj):
        get_cl = obj.related_class
        get_quest = get_cl.single_quiz.all()
        for c in get_quest:
            return c.question_name

    def get_selected_answerId(self, obj):
        user_class = UserClassQuestionsRecord.objects.filter(user=obj.user).all()
        for c in user_class:
            return c.selected_answer.answer_name

    def get_user_id(self,obj):
        user_id = obj.user
        return user_id.id

    def get_is_correct(self,obj):
        user_class = UserClassQuestionsRecord.objects.filter(user=obj.user, question__singleclass=obj.related_class).last()
        if user_class.is_correct == 'True':
            return True
        else:
            return False

    def get_xp_collected(self,obj):
        user_class = UserClassQuestionsRecord.objects.filter(user=obj.user, is_correct ='True').last()
        if user_class:
            return user_class.question.singleclass.xp_token
        else:
            return 'No xp were collected in this class'

    def get_selected_option(self, obj):
        pass


    def get_date_attempt(self, obj):
        get_date = obj.updated_at
        return get_date


    class Meta:
        model = ClassAttempt
        fields = ['id', 'question_id', 'selected_answerId', 'user_id', 'is_correct', 'xp_collected', 'date_attempt']


# Security to be review
class ClassAttemptAllSerializer(serializers.ModelSerializer):

    class Meta:
        model = ClassAttempt
        fields = '__all__'


class QuestionAttemptClassSerializer(serializers.ModelSerializer):


    class Meta:
        model = UserClassQuestionsRecord
        fields = ['question', 'selected_answer', 'is_correct', 'xp_collected']


