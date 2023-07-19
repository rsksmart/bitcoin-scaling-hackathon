from rest_framework import serializers
from .models import UserClassQuestionsRecord


class User_Class_Question_RecordSerializer(serializers.ModelSerializer):


    class Meta:
        model = UserClassQuestionsRecord
        fields = '__all__'

