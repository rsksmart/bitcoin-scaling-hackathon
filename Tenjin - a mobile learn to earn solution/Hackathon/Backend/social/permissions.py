from rest_framework import permissions

from social.models import Friend


class IsOwnerOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.user == request.user


class IsNotOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.user != request.user


class ObjNotLoggedInUser(permissions.BasePermission):
    message = 'Users cannot do this operation with themselves.'

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True
        # requesting user must be .
        return obj != request.user


class FriendRequestDoesNotExist(permissions.BasePermission):
    message = 'This friend request already exists'

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True
        # requesting user must be .
        return not Friend.objects.filter(requester=request.user, receiver=obj).exists()


class IsPendingToAllowUpdate(permissions.BasePermission):
    message = 'You can only modify pending requests or you are not part of this friendship.'

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method == 'PATCH':
            return obj.status == 'P'
        if request.method == 'DELETE':
            return obj.requester == request.user or obj.receiver == request.user
        return True
