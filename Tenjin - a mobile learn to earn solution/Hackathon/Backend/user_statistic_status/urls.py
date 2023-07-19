from django.urls import path

from Blockchain.RSK_API import PaymentView
from user_statistic_status.views import LeaderboardMonthView, \
    LeaderboardView, ListUserStatus, LeaderboardDayView, LeaderboardWeekView, \
    ListUserStatusWithProgress, RetrieveUpdateDestroyUSSByID, \
    UpdateUserSatisticView, leaderboard

urlpatterns = [
    # /api/users/status/
    path('', ListUserStatus.as_view()),
    path('progress/<int:pk>/', ListUserStatusWithProgress.as_view()),
    path('update/', UpdateUserSatisticView.as_view()),
    path('leaderboard/', LeaderboardView.as_view()),
    path('leaderboard/day/', LeaderboardDayView.as_view()),
    path('leaderboard/week/', LeaderboardWeekView.as_view()),
    path('leaderboard/month/', LeaderboardMonthView.as_view()),
    path('leaderboardtemplate/', leaderboard, name='leaderboardtemplate'),
    path('<str:wallet_address>/', RetrieveUpdateDestroyUSSByID.as_view()),
    path('payment/<int:amount>/', PaymentView.as_view()),

]

