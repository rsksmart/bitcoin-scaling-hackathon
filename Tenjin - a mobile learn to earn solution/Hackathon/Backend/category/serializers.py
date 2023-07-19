from django.contrib.auth import get_user_model

# from project.settings import CLOUDFRONT_DOMAIN
from .models import Category
from rest_framework import serializers

User = get_user_model()


class CategorySerializer(serializers.ModelSerializer):


    # image_url = serializers.SerializerMethodField()
    #
    # icon = serializers.SerializerMethodField()
    #
    # def get_image_url(self, obj):
    #     if obj.description:
    #         return f"https://{CLOUDFRONT_DOMAIN}/{obj.description.name}"
    #     return None
    #
    # def get_icon(self, obj):
    #     if obj.icon:
    #         return f"https://{CLOUDFRONT_DOMAIN}/{obj.icon.name}"
    #     return None

    class Meta:
        model = Category
        fields = '__all__'


class CategorySerializerID(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id']


class UserCustomAdminSerializer(serializers.ModelSerializer):

    total_user = serializers.SerializerMethodField()

    def get_total_user(self):
        user = User.objects.all()
        return user.list().count()



