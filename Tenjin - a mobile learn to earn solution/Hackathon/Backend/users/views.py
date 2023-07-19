import json
import random
import string
from datetime import timedelta, datetime
from allauth.account.adapter import get_adapter
from allauth.account.forms import default_token_generator
from allauth.account.utils import user_pk_to_url_str
from allauth.socialaccount.models import SocialAccount
from allauth.utils import build_absolute_uri
from django.conf import settings
from django.shortcuts import render
from django.urls import reverse
from django.utils.encoding import force_str, force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from django.contrib.auth import get_user_model
from django.db.models import Q
from firebase_admin import messaging
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListAPIView, RetrieveAPIView, GenericAPIView, RetrieveUpdateAPIView, UpdateAPIView, \
    DestroyAPIView, CreateAPIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from referral_payout.models import ReferralPayout
from social.models import Friend
from .serializers import UserSerializer, UserProfileSerializer, UserProfileSerializerUpdate, SocialInfoSerializer, \
    UserAboutMeSerializer, ListFriendsSerializer, BlockedFriendSerializer, UserAboutMeLeaderboardSerializer


User = get_user_model()


class ListUserAPIView(ListAPIView):
    """
    List all Users

    Get request
    """
    queryset = User.objects.all().order_by('pk')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['User'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class RetrieveUserByIDAPIView(RetrieveAPIView):
    """
    Retrieve User info by ID

    Retrieve User info by ID
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class SearchUserByStringAPIView(ListAPIView):

    queryset = User.objects.all().order_by('pk')
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        search = self.request.query_params.get('search')
        user = self.request.user
        friends = Friend.objects.filter(
            Q(requester=user) | Q(receiver=user)
        )
        blocked_users = [
            friend.receiver if friend.requester == user else friend.requester
            for friend in friends if friend.is_blocked
        ]
        excluded_friends = [
            friend.receiver if friend.requester == user else friend.requester
            for friend in friends if friend.status == "A"
        ]
        queryset = self.queryset.filter(
            username__icontains=search,
            is_active=True,
        ).exclude(pk__in=[user.pk] + [b.pk for b in blocked_users + excluded_friends])[:20]
        return queryset

    @swagger_auto_schema(tags=['User'], manual_parameters=[
        openapi.Parameter(
            'search', openapi.IN_QUERY, type=openapi.TYPE_STRING, description='Search string'
        ),
    ])

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class BlockedUsersAPIView(ListAPIView):

    serializer_class = BlockedFriendSerializer

    @swagger_auto_schema(tags=['User'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        receiver_id = self.kwargs['id']
        blocked_friends = Friend.objects.filter(receiver=receiver_id, is_blocked=True)
        data = [(friend.requester.pk, friend.pk) for friend in blocked_friends]
        return data


# Get logged in user profile
class GetUserMeAPIView(GenericAPIView):

    queryset = User.objects.all().order_by('pk')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['User'])
    def get(self, request, *args, **kwargs):
        instance = self.request.user
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @swagger_auto_schema(tags=['User'])
    def patch(self, request, *args, **kwargs):
        instance = self.request.user
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)



class RetrieveUpdateUserByID(RetrieveUpdateAPIView):

    queryset = User.objects.all().order_by('pk')
    serializer_class = UserProfileSerializerUpdate
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    @swagger_auto_schema(tags=['User'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(tags=['User'])
    def put(self, request, *args, **kwargs):
        return self.update_user(request, *args, **kwargs)

    @swagger_auto_schema(tags=['User'])
    def patch(self, request, *args, **kwargs):
        return self.update_user(request, *args, **kwargs)

    def update_user(self, request, *args, **kwargs):
        instance = self.get_object()
        avatar_image = request.data.get('avatar')

        if avatar_image:
            # Generate a two-digit ID for the image
            image_id = ''.join(random.choices(string.digits, k=2))
            # Get the original filename
            original_filename = avatar_image.name
            # Get the file extension from the original filename
            file_extension = original_filename.split('.')[-1]
            # Create the new filename with the original name + ID + extension
            new_filename = f'{original_filename}_ID-{image_id}.{file_extension}'
            # Set the filename as the new filename
            avatar_image.name = new_filename

            # Update the avatar field with the new image
            instance.avatar = avatar_image

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class AboutMeView(RetrieveAPIView):

    queryset = User.objects.all().order_by('pk')
    serializer_class = UserAboutMeSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    @swagger_auto_schema(tags=['User'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)



class AboutMeLeaderboardView(APIView):


    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['User'])
    def get(self, request, id, format=None):
        obj = User.objects.get(id=id)
        serializer = UserAboutMeLeaderboardSerializer(obj, context={'request': request, 'id': id})
        return Response(serializer.data)


class RefView(UpdateAPIView):

    queryset = User.objects.all().order_by('pk')
    permission_classes = [IsAuthenticated]
    serializer_class = None

    @swagger_auto_schema(tags=['User'])
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

    @swagger_auto_schema(tags=['User'])
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):

        referral_code = self.kwargs.get('ref')

        user_ref_account = User.objects.filter(personal_referral_code=referral_code).first()


        if user_ref_account:

            user_signed_up = User.objects.filter(id=request.user.id).first()

            ReferralPayout.objects.get_or_create(user=user_signed_up, referring_user=user_ref_account)

            User.objects.filter(id=user_signed_up.id).update(given_referral_code=referral_code)

            return Response(f'Congrats both user will be  accredited 50 sats once You reach level 2',
                            status=status.HTTP_200_OK)
        else:
            return Response(f'Invalid referral code', status=status.HTTP_400_BAD_REQUEST)



class UserRefferalView(RetrieveAPIView):

    queryset = User.objects.all().order_by('pk')
    serializer_class = ListFriendsSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    @swagger_auto_schema(tags=['User'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        user_id = self.kwargs.get('id')
        referral_code = User.objects.filter(id=user_id).first().personal_referral_code

        if referral_code:
            referrals = User.objects.filter(given_referral_code=referral_code)
            serializer = ListFriendsSerializer(referrals, many=True)
            return Response(serializer.data)
        else:
            return Response({'detail': 'No referrals yet for this user'}, status=status.HTTP_204_NO_CONTENT)






class RetrieveSocialInforByID(RetrieveAPIView):

    queryset = User.objects.all().order_by('pk')
    serializer_class = SocialInfoSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    @swagger_auto_schema(tags=['User'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)




class DeleteUserByID(DestroyAPIView):

    """
    Delete Account of logged in User

    Delete request
    """

    queryset = User.objects.all()
    serializer_class = None
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['User'])
    def delete(self, request, *args, **kwargs):
        user = request.user
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


