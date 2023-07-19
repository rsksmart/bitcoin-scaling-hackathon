from django.urls import path
from .views import ListUserAPIView, SearchUserByStringAPIView, RetrieveUpdateUserByID, AboutMeView, \
    BlockedUsersAPIView, RefView, UserRefferalView, AboutMeLeaderboardView,  DeleteUserByID

urlpatterns = [
    # backend/api/users/
    path('', ListUserAPIView.as_view()),
    path('me/<int:id>', RetrieveUpdateUserByID.as_view()),
    path('delete/', DeleteUserByID.as_view()),
    path('about-me/<int:id>', AboutMeView.as_view()),
    path('about-me/leaderbord/<int:id>', AboutMeLeaderboardView.as_view()),
    path('user-refferal/<int:id>', UserRefferalView.as_view()),
    path('refferal/<str:ref>', RefView.as_view()),
    path('filter/', SearchUserByStringAPIView.as_view()),
    path('blocked/<int:id>', BlockedUsersAPIView.as_view()),

]
