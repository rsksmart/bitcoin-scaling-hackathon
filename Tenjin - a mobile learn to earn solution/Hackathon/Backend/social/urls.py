from django.urls import path, include
from social.views.friends import CreateFriendRequest, ListFriends, \
    ListFriendRequests, ListPendingFriendRequest, UpdateFriendRequest, FriendsDayLeaderBoard, \
    FriendsWeekLeaderBoard, FriendsGlobalLeaderboardView, FriendsMonthLeaderBoard

follow_patterns = [
    #path('followers/', ListFollowers.as_view(), name='list-followers'),
    #path('following/', ListFollowing.as_view(), name='list-following'),
    #path('toggle-follow/<int:user_id>/', FollowUnfollowUser.as_view(), name='follow-unfollow-user'),
]


friend_patterns = [
    # backend/api/social/friends/
    path('', ListFriends.as_view(), name='list-friends'),
    path('request/<int:user_id>/', CreateFriendRequest.as_view(), name='create-friend-request'),
    path('requests/<int:friend_request_id>/', UpdateFriendRequest.as_view(),
         name='retrieve-update-destroy-friend-request'),
    path('requests/', ListFriendRequests.as_view(), name='list-friend-request'),
    #path('pending/', ListPendingFriendRequest.as_view(), name='list-pending-friend-request'),
    path('leaderboard/', FriendsGlobalLeaderboardView.as_view()),
    path('leaderboard/day/', FriendsDayLeaderBoard.as_view()),
    path('leaderboard/week/', FriendsWeekLeaderBoard.as_view()),
    path('leaderboard/month/', FriendsMonthLeaderBoard.as_view()),

]

urlpatterns = [
    #path('followers/', include(follow_patterns)),
    path('friends/', include(friend_patterns)),
]
