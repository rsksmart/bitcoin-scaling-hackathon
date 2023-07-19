from rest_framework import serializers
from chapter_attempt.models import ChapterAttempt




class ChapterAttemptAllSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChapterAttempt
        fields = '__all__'
