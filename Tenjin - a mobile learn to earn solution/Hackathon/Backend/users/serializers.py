from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.db.models import Q, Sum
from social.models import Friend
from user_statistic_status.models import UserStatisticStatus, UserLeaderboardTracking

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):


    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'about_me']
        write_only_fields = ['username']
        read_only = True


    def validate(self, data):
        email = data.get('email', None)
        if email:
            data['username'] = email
        return data



class BlockedFriendSerializer(serializers.Serializer):

    requester_id = serializers.IntegerField()
    friend_id = serializers.IntegerField()
    requester = UserSerializer()

    def to_representation(self, instance):
        requester_id, friend_id = instance
        requester = User.objects.get(pk=requester_id)
        return {
            'friend_id': friend_id,
            'requester': UserSerializer(requester).data
        }


class UserProfileSerializer(serializers.ModelSerializer):

    friendship_status = serializers.SerializerMethodField()

    lifetime_xp = serializers.SerializerMethodField()

    monthly_rank = serializers.SerializerMethodField()


    def get_lifetime_xp(self, obj):

        user_info = UserStatisticStatus.objects.filter(user=obj.id).first()

        return user_info.total_xp


    def get_monthly_rank(self, obj):

        month = timezone.now().month

        leaderboard = UserLeaderboardTracking.objects.filter(created_at__month=month) \
            .values('user_id', 'user') \
            .annotate(xp_val=Sum('xp_value')) \
            .order_by('-xp_val') \


        for i, entry in enumerate(leaderboard):
            if entry['user'] == obj.id:
                return i + 1
        return None


    def get_friendship_status(self, obj):
        user_id = obj.id
        friends_obj = Friend.objects.filter(
            Q(receiver=self.context['request'].user) |
            Q(requester=self.context['request'].user)
        )
        for friend in friends_obj:
            if user_id in (friend.requester_id, friend.receiver_id):
                return friend.status
        return None


    class Meta:

        model = User
        fields = ['id', 'username', 'about_me', 'friendship_status',
                  'lifetime_xp', 'monthly_rank']





class UserProfileSerializerUpdate(serializers.ModelSerializer):



    class Meta:

        model = User
        fields = '__all__'
        read_only = ['email', 'personal_referral_code', 'given_referral_code']





class UserAboutMeLeaderboardSerializer(serializers.ModelSerializer):

    lifetime_xp = serializers.SerializerMethodField()


    monthly_rank = serializers.SerializerMethodField()

    friendship_status = serializers.SerializerMethodField()


    def get_lifetime_xp(self, obj,  *args, **kwargs):

        user_info = UserStatisticStatus.objects.filter(user=obj.id).first()

        return user_info.total_xp


    def get_monthly_rank(self, obj,  *args, **kwargs):

        month = timezone.now().month

        leaderboard = UserLeaderboardTracking.objects.filter(created_at__month=month) \
            .values('user_id', 'user') \
            .annotate(xp_val=Sum('xp_value')) \
            .order_by('-xp_val') \


        for i, entry in enumerate(leaderboard):
            if entry['user'] == obj.id:
                return i + 1
        return None


    def get_friendship_status(self, obj,  *args, **kwargs):
        receiver= obj.id
        requester = self.context['request'].user
        existing_relation = Friend.objects.filter(
            Q(requester=requester, receiver=receiver) | Q(requester=receiver, receiver=requester)
        ).first()


        if not existing_relation:
            return False
        elif existing_relation.is_blocked == True:
            return 'Blocked'
        return existing_relation.status



    class Meta:

        model = User
        fields = ['username', 'about_me', 'lifetime_xp',
                  'monthly_rank', 'friendship_status']





class UserAboutMeSerializer(serializers.ModelSerializer):

    lifetime_xp = serializers.SerializerMethodField()

    monthly_rank = serializers.SerializerMethodField()

    def get_lifetime_xp(self, obj):

        user_info = UserStatisticStatus.objects.filter(user=obj.id).first()

        return user_info.total_xp

    def get_monthly_rank(self, obj):

        month = timezone.now().month

        leaderboard = UserLeaderboardTracking.objects.filter(created_at__month=month) \
            .values('user_id', 'user') \
            .annotate(xp_val=Sum('xp_value')) \
            .order_by('-xp_val') \


        for i, entry in enumerate(leaderboard):
            if entry['user'] == obj.id:
                return i + 1
        return None



    class Meta:

        model = User
        fields = ['username', 'about_me',
                  'lifetime_xp','monthly_rank']


class SocialInfoSerializer(serializers.ModelSerializer):


    class Meta:

        model = User
        fields = ['friends', 'friend_requests_received']


class RefViewSerializer(serializers.ModelSerializer):
    class Meta:

        model = User
        fields = []


class ListFriendsSerializer(serializers.ModelSerializer):


    friend_status_id = serializers.SerializerMethodField()


    def get_friend_status_id(self, obj):

        requester = self.context['request'].user

        friend_status_queryset1 = Friend.objects.filter(requester=requester, receiver=obj.id, status='A')
        friend_status_queryset2 = Friend.objects.filter(requester=obj.id, receiver=requester, status='A')
        friend_status_dict1 = friend_status_queryset1.values('id').first()
        friend_status_dict2 = friend_status_queryset2.values('id').first()
        friend_status_id = friend_status_dict1['id'] if friend_status_dict1 else friend_status_dict2['id']

        return friend_status_id


    class Meta:

        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'username', 'about_me', 'friend_status_id']




