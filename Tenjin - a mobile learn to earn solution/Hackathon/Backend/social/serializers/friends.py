from django.contrib.auth import get_user_model
from rest_framework import serializers
# from project.settings import CLOUDFRONT_DOMAIN
from social.models import Friend
User = get_user_model()




class FriendSerializer(serializers.ModelSerializer):

    requester = serializers.SerializerMethodField()
    receiver = serializers.SerializerMethodField()


    def get_receiver(self, obj):
        friend = Friend.objects.filter(receiver=obj.receiver)
        return RecevierSerializer(friend, many=True).data


    def get_requester(self, obj):
        friend = Friend.objects.all()
        return RequesterSerializer(friend, many=False).data


    class Meta:
        model = Friend
        fields = ['id', 'requester', 'receiver', 'status']


class SendFriendSerializer(serializers.ModelSerializer):

    requester_username = serializers.SerializerMethodField()
    receiver_username = serializers.SerializerMethodField()

    def get_requester_username(self, obj):
        return obj.requester.username

    def get_receiver_username(self, obj):
        return obj.receiver.username

    def get_id(self, obj):
        return obj.id

    class Meta:
        model = Friend
        fields = ['id', 'requester', 'requester_username', 'receiver', 'receiver_username', 'status']



class PendingFriendsRequestSerializer(serializers.ModelSerializer):

    requester = serializers.SerializerMethodField()


    def get_requester(self, obj):
        friend = Friend.objects.filter(id=obj.id)
        return RequesterSerializer(friend, many=False).data


    class Meta:
        model = Friend
        fields = ['id', 'requester', 'status']





class RequesterSerializer(serializers.ModelSerializer):

    id = serializers.SerializerMethodField()

    email = serializers.SerializerMethodField()

    username = serializers.SerializerMethodField()

    first_name = serializers.SerializerMethodField()

    last_name = serializers.SerializerMethodField()

    # avatar = serializers.SerializerMethodField()

    about_me = serializers.SerializerMethodField()


    def get_id(self,obj):
        return obj.first().requester.id

    def get_email(self,obj):
        return obj.first().requester.email


    def get_username(self,obj):
        return obj.first().requester.username


    def get_first_name(self,obj):
        return obj.first().requester.first_name

    def get_last_name(self,obj):
        return obj.first().requester.last_name

    # def get_avatar(self,obj):
    #     ava = obj.first().requester.avatar
    #     if ava:
    #         return f"https://{CLOUDFRONT_DOMAIN}/{ava.name}"
    #     else:
    #         return None

    def get_about_me(self,obj):
        return obj.first().requester.about_me


    class Meta:
        model = Friend
        fields = ['id', 'email','username', 'first_name', 'last_name', 'avatar', 'about_me']




class RecevierSerializer(serializers.ModelSerializer):

    id = serializers.SerializerMethodField()

    email = serializers.SerializerMethodField()

    username = serializers.SerializerMethodField()

    first_name = serializers.SerializerMethodField()

    last_name = serializers.SerializerMethodField()

    # avatar = serializers.SerializerMethodField()

    about_me = serializers.SerializerMethodField()


    def get_id(self,obj):
        return obj.receiver.id

    def get_email(self,obj):
        return obj.receiver.email

    def get_username(self,obj):
        return obj.receiver.username

    def get_first_name(self,obj):
        return obj.receiver.first_name

    def get_last_name(self,obj):
        return obj.receiver.last_name

    # def get_avatar(self,obj):
    #     ava = obj.receiver.avatar
    #     if ava:
    #         return f"https://{CLOUDFRONT_DOMAIN}/{ava.name}"
    #     else:
    #         return None

    def get_about_me(self,obj):
        return obj.receiver.about_me

    class Meta:
        model = Friend
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'avatar', 'about_me']


class FriendUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friend
        fields = ['status', 'is_blocked']



