import calendar
from datetime import datetime, timedelta, time
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth import get_user_model
from django.db.models import Sum
from django.http import HttpResponse
from django.shortcuts import render
from django.utils import timezone
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, \
    UpdateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView

from Blockchain.RSK_API import sendRSKWallet
from category.models import Category
from user_statistic_status.models import UserStatisticStatus, UserLeaderboardTracking
from user_statistic_status.serializers import UserStatisticsStatusSerializer, \
    UserLeaderboardSerializer, UserMyStatusWithProgress2, \
    UserLeaderboardGlobalSerializer, UpdateUserSatisticSerializer, UserRBTCSerializer

User = get_user_model()



class ListUserStatus(ListAPIView):
    """
    User Statistic Status

    Get request works when user is Authenticated
    """

    queryset = UserStatisticStatus.objects.all().order_by('pk')
    serializer_class = UserStatisticsStatusSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['User_status'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)



class ListUserStatusWithProgress(ListAPIView):

    """
    User current progress by category ID with User statistic status

    Get request works when user is Authenticated
    """

    queryset = Category.objects.all()
    serializer_class = UserMyStatusWithProgress2
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['User_status'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        queryset = self.queryset.filter(id=self.kwargs.get('pk'))
        return queryset

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        if response.data:
            return response
        return Response(status.HTTP_404_NOT_FOUND)


class LeaderboardView(ListAPIView):
    """
    User Global Leaderboard based on XP token

    Get request
    """

    queryset = UserStatisticStatus.objects.all()
    serializer_class = UserLeaderboardGlobalSerializer
    permission_classes = [AllowAny]

    @swagger_auto_schema(tags=['User_status'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        return self.queryset.filter(user__is_verified=True).values('user_id', 'user') \
                            .annotate(xp_val=Sum('total_xp')) \
                            .order_by('-xp_val')[:20] \



class LeaderboardDayView(ListAPIView):
    """
    User Leaderboard based on current Day and XP token

    Get request
    """

    queryset = UserLeaderboardTracking.objects.all()
    serializer_class = UserLeaderboardSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['User_status'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        return self.queryset.filter(created_at__date=timezone.now()) \
                            .values('user_id', 'user') \
                            .annotate(xp_val=Sum('xp_value')) \
                            .order_by('-xp_val')[:20] \



class LeaderboardWeekView(ListAPIView):
    """
    User Leaderboard based on current Week and XP token

    Get request
    """

    queryset = UserLeaderboardTracking.objects.all()
    serializer_class = UserLeaderboardSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['User_status'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        week_start = datetime.today() - timedelta(days=datetime.today().weekday())
        week_start = datetime.combine(week_start, time.min)
        week_end = week_start + timedelta(days=6, hours=23, minutes=59, seconds=59)

        return self.queryset.filter(created_at__gte=week_start, created_at__lt=week_end) \
                   .values('user_id', 'user__username') \
                   .annotate(xp_val=Sum('xp_value')) \
                   .order_by('-xp_val')[:20]


class LeaderboardMonthView(ListAPIView):

    """
    User Leaderboard based on current Month and XP token

    Get request
    """

    queryset = UserLeaderboardTracking.objects.all()
    serializer_class = UserLeaderboardSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['User_status'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):

        month = timezone.now().month

        return self.queryset.filter(created_at__month=month) \
                   .values('user_id', 'user') \
                   .annotate(xp_val=Sum('xp_value')) \
                   .order_by('-xp_val')[:20] \



@staff_member_required
def leaderboard(request, **kwargs):

    if request.method == 'GET':
        default_year = timezone.now().year
        default_month = timezone.now().month
        selected_month = request.GET.get('month')
        selected_year = request.GET.get('year')
        if selected_month:
            selected_month = int(selected_month)
        else:
            selected_month = default_month

        if selected_year:
            selected_year = int(selected_year)
        else:
            selected_year = default_year
            
        if selected_month not in range(1, 13):
            return HttpResponse('Invalid month provided')
        # get first day based on month and year selected
        first_day = datetime(selected_year, selected_month, 1)
        # checking for last day of the month selected by going to the next month and removing one day
        # if month is 12 next month is 13 and will throw an error so if condition fixes issue
        if selected_month == 12:
            last_day = timezone.make_aware(datetime(selected_year + 1, 1, 1) - timedelta(days=1), timezone=timezone.utc)
        else:
            last_day = timezone.make_aware(datetime(selected_year, selected_month + 1, 1) - timedelta(days=1), timezone=timezone.utc)

        if first_day.weekday() == 0:  # If the first day of the month is a Monday
            week_start = first_day
        else:
            week_start = first_day + timedelta(days=(7 - first_day.weekday()))
        week_start = timezone.make_aware(week_start, timezone.utc)
        week_end = week_start + timedelta(days=6, hours=23, minutes=59, seconds=59)
        month_name = calendar.month_name[int(selected_month)]
        users = UserLeaderboardTracking.objects.all()
        # getting the month view
        result = users.filter(created_at__year=selected_year, created_at__month=selected_month) \
                     .values('user_id', 'user__username') \
                     .annotate(xp_val=Sum('xp_value')) \
                     .order_by('-xp_val')[:20]
        result2 = []
        week = []
        # getting the week view for the whole month
        while week_start <= last_day:
            res = users.filter(created_at__year=selected_year, created_at__month=selected_month,
                               created_at__range=[week_start, week_end]) \
                      .values('user_id', 'user__username') \
                      .annotate(xp_val=Sum('xp_value')) \
                      .order_by('-xp_val')[:20]
            # save result for every iteration
            # result2.append(res)
            # Append the start and end dates of the current week to the week list
            week_data = {'start_date': week_start.strftime("%b %d"), 'end_date': week_end.strftime("%b %d"),
                         'user_data': res}
            week.append(week_data)
            # Move on to the next week
            week_start = week_end + timedelta(days=0)
            week_end = week_start + timedelta(days=7)
            # week.append(week_start.isoformat())

        context = {'data': result,
                   'data2': week,
                   'month_name': month_name,
                   'default_month': default_month,
                   'selected_month': str(selected_month),
                   'default_year': default_year,
                   'selected_year': str(selected_year)}


        return render(request, 'account/leaderboard.html', context)



class UpdateUserSatisticView(UpdateAPIView):
    """
    Update User current category

    Put, Patch request
    """

    queryset = UserStatisticStatus.objects.all()
    serializer_class = UpdateUserSatisticSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['User_status'])
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @swagger_auto_schema(tags=['User_status'])
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)


    def update(self, request, *args, **kwargs):
        user = self.request.user
        category = request.data.get('category_id')

        exs_cat = Category.objects.filter(id=category)

        if exs_cat == None :
            return Response(
                'No category with this id',
                status=status.HTTP_404_NOT_FOUND)
        else:
            UserStatisticStatus.objects.filter(user=user).update(current_category=category)
            return Response(
                'Current user category was updated',
                status=status.HTTP_200_OK)


class RetrieveUpdateDestroyUSSByID(RetrieveAPIView):

    queryset = User.objects.all()
    serializer_class = UserRBTCSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'wallet_address'

    @swagger_auto_schema(tags=['User_status'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        return self.queryset.filter(wallet_address=self.kwargs.get('wallet_address'))




