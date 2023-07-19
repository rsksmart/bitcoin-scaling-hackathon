from rest_framework import serializers
from .models import UserChapterQuestionsRecord


class UserChapterQuestionRecordSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserChapterQuestionsRecord
        fields = '__all__'

