from django.contrib.auth import get_user_model
from rest_framework.generics import ListAPIView, GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from social.permissions import ObjNotLoggedInUser
from users.serializers import UserSerializer

User = get_user_model()


class ListFollowers(ListAPIView):
    """
    get:
    List all followers of the logged-in User.
    """
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def filter_queryset(self, queryset):
        return self.request.user.followers


class ListFollowing(ListAPIView):
    """
    get:
    List all Users the logged-in User is following.
    """
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def filter_queryset(self, queryset):
        return self.request.user.followees


class FollowUnfollowUser(GenericAPIView):
    """
    post:
    Toggle following User.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, ObjNotLoggedInUser]
    lookup_url_kwarg = 'user_id'

    def post(self, request, **kwargs):
        target_user = self.get_object()
        user = request.user
        if target_user in user.followees.all():
            user.followees.remove(target_user)
            return Response(self.get_serializer(instance=target_user).data)
        user.followees.add(target_user)
        return Response(self.get_serializer(instance=target_user).data)
