from datetime import date, timedelta
from django.contrib.auth import get_user_model
from django.db.models import Q, Sum
from django.utils import timezone
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView, \
    RetrieveDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from social.models import Friend
from social.permissions import ObjNotLoggedInUser, FriendRequestDoesNotExist, IsPendingToAllowUpdate
from social.serializers.friends import FriendSerializer, FriendUpdateSerializer, PendingFriendsRequestSerializer, \
    SendFriendSerializer
from user_statistic_status.models import UserLeaderboardTracking
from user_statistic_status.serializers import UserLeaderboardSerializer
from users.serializers import ListFriendsSerializer

User = get_user_model()


class CreateFriendRequest(CreateAPIView):
    """
    Send a friend request

    Create a new pending friend request
    """
    queryset = User.objects.all()
    serializer_class = SendFriendSerializer
    lookup_url_kwarg = 'user_id'
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Social'])
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        receiver_user = self.kwargs.get('user_id')
        receiver = User.objects.filter(id=receiver_user).first()
        requester = self.request.user
        existing_relation = Friend.objects.filter(requester=requester, receiver=receiver, status='R').first()
        if existing_relation:
            Friend.objects.filter(requester=requester, receiver=receiver).update(status='P')
            updated_relation = Friend.objects.filter(requester=requester, receiver=receiver).first()
            return Response(self.get_serializer(instance=updated_relation).data, status=status.HTTP_200_OK)
        Friend.objects.get_or_create(requester=requester, receiver=receiver)
        friendship = Friend.objects.filter(requester=requester, receiver=receiver).first()
        return Response(self.get_serializer(instance=friendship).data, status=status.HTTP_201_CREATED)


class RetrieveUpdateDestroyFriendRequest(RetrieveDestroyAPIView):
    """
    get:
    Retrieve a friend request
    patch:
    delete:
    Delete a friend request.
    Only allowed if logged-in user is part of the friendship, as specified in IsPendingToAllowUpdate
    """
    queryset = Friend.objects.all()
    serializer_class = FriendSerializer
    lookup_url_kwarg = 'friend_request_id'
    permission_classes = [IsAuthenticated, IsPendingToAllowUpdate]


class UpdateFriendRequest(UpdateAPIView):
    """
    Update the status of a friend request

    Update the status of a friend request
    """
    queryset = Friend.objects.all()
    serializer_class = FriendUpdateSerializer
    lookup_url_kwarg = 'friend_request_id'
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Social'])
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

    @swagger_auto_schema(tags=['Social'])
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)


class ListFriends(ListAPIView):
    """
    List all of logged-in users accepted friends.

    List all of logged-in users accepted friends.
    """
    serializer_class = ListFriendsSerializer
    queryset = User.objects.all()

    @swagger_auto_schema(tags=['Social'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def filter_queryset(self, queryset):
        return self.request.user.friends


class FriendsGlobalLeaderboardView(ListAPIView):
    """
    Friends Global Leaderboard based on XP token

    Get request
    """
    queryset = UserLeaderboardTracking.objects.all()
    serializer_class = UserLeaderboardSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Social'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


    def filter_queryset(self, queryset):
        users = self.request.user.friends
        queryset = queryset.filter(user__in=users)
        queryset = queryset.values('user_id', 'user')
        queryset = queryset.annotate(xp_val=Sum('xp_value'))
        queryset = queryset.order_by('-xp_val')[:20]

        return queryset


class FriendsDayLeaderBoard(ListAPIView):
    """
    List friends Leaderboard based on XP token by Day

    Get request
    """
    serializer_class = UserLeaderboardSerializer
    queryset = UserLeaderboardTracking.objects.all()
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Social'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def filter_queryset(self, queryset):
        users = self.request.user.friends
        queryset = queryset.filter(created_at__date=timezone.now())
        queryset = queryset.filter(user__in=users)
        queryset = queryset.values('user_id', 'user')
        queryset = queryset.annotate(xp_val=Sum('xp_value'))
        queryset = queryset.order_by('-xp_val')[:20]

        return queryset



class FriendsWeekLeaderBoard(ListAPIView):
    """
    List friends Leaderboard based on XP token by Week

    Get request
    """

    serializer_class = UserLeaderboardSerializer
    queryset = UserLeaderboardTracking.objects.all()
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Social'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def filter_queryset(self, queryset):

        week_start = date.today()
        week_start -= timedelta(days=week_start.weekday())
        week_end = week_start + timedelta(days=7)
        users = self.request.user.friends
        queryset = queryset.filter(created_at__gte=week_start,
                                   created_at__lt=week_end)
        queryset = queryset.filter(user__in=users)
        queryset = queryset.values('user_id', 'user')
        queryset = queryset.annotate(xp_val=Sum('xp_value'))
        queryset = queryset.order_by('-xp_val')[:20]

        return queryset



class FriendsMonthLeaderBoard(ListAPIView):

    """
    List friends Leaderboard based on XP token by Month


    Get request
    """
    queryset = UserLeaderboardTracking.objects.all()
    serializer_class = UserLeaderboardSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Social'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def filter_queryset(self, queryset):
        users = self.request.user.friends
        month = timezone.now().month
        queryset = queryset.filter(created_at__month=month)
        queryset = queryset.filter(user__in=users)
        queryset = queryset.values('user_id', 'user')
        queryset = queryset.annotate(xp_val=Sum('xp_value'))
        queryset = queryset.order_by('-xp_val')[:20]

        return queryset



class ListFriendRequests(ListAPIView):
    """
    List all friend requests with pending status


    List all friend requests with pending status
    """
    serializer_class = PendingFriendsRequestSerializer
    queryset = Friend.objects.all()
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Social'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


    def filter_queryset(self, queryset):
        requests = Friend.objects.filter(receiver=self.request.user, status__startswith='P')
        return requests


class ListPendingFriendRequest(ListAPIView):
    """
    List all friend requests with pending status


    List all friend requests with pending status
    """

    serializer_class = FriendSerializer
    queryset = Friend.objects.all()

    @swagger_auto_schema(tags=['Social'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def filter_queryset(self, queryset):
        requests = Friend.objects.filter(
            Q(receiver=self.request.user) | Q(requester=self.request.user)
        ).distinct()
        return requests.filter(status__startswith='P')








