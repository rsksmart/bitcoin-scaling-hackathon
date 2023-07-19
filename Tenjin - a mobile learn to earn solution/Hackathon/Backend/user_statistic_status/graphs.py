import datetime
import plotly.graph_objs as go
from django.contrib.auth import get_user_model
from django.db.models import Count
from django.db.models.functions import TruncDay

from Blockchain.RSK_API import numOfPayouts, totalPayouts, contractBalance
from class_attempt.models import ClassAttempt
from django.shortcuts import render


User = get_user_model()

def user_signup_stats(request):
    # Get data for the new user signups chart
    start_date = datetime.datetime(2022, 8, 31, tzinfo=datetime.timezone.utc)
    end_date = datetime.datetime.now(datetime.timezone.utc)

    signups = (
        User.objects
            .filter(date_joined__gte=start_date)
            .annotate(day=TruncDay('date_joined'))
            .values('day')
            .annotate(count=Count('id'))
            .order_by('day')
    )

    # Convert the query result to x_data and y_data for the new user signups chart
    x_data = [s['day'] for s in signups]
    y_data = [s['count'] for s in signups]

    # Create a line chart for new user signups over time
    line_data = [go.Scatter(
        x=x_data,
        y=y_data,
        mode='lines+markers',
        name='New User Signups'
    )]
    line_layout = go.Layout(
        title='New User Signups',
        xaxis=dict(title='Date'),
        yaxis=dict(title='Number of Signups')
    )
    line_fig = go.Figure(data=line_data, layout=line_layout)
    line_plot_div = line_fig.to_html(full_html=False)

    # Get data for the active users chart
    thirty_days_ago = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=30)
    completed_attempts = ClassAttempt.objects.filter(status='completed', updated_at__gte=thirty_days_ago)

    # Get the total number of active users
    AU = completed_attempts.values('user').distinct().count()

    # Get the total number of users
    TU = User.objects.filter(date_joined__lte=end_date).count()

    # Get the percentage of active users
    ACT_USE = (AU / TU) * 100

    ACTIVE_USERS = round(ACT_USE, 2)

    # Create a pie chart for active users
    active_users_data = [go.Pie(
        labels=['Active Users', 'Inactive Users'],
        values=[AU, TU - AU],
        hole=.6,
        marker=dict(colors=['rgb(63, 81, 181)', 'rgb(236, 239, 241)']),
        name='Active Users'
    )]
    active_users_layout = go.Layout(
        title='Active Users',
        annotations=[dict(
            font=dict(size=20),
            showarrow=False,
            text='',
            x=0.5,
            y=0.5
        )]
    )
    active_users_fig = go.Figure(data=active_users_data, layout=active_users_layout)
    active_users_plot_div = active_users_fig.to_html(full_html=False)

    # Get the average active users per day

    # Define start and end dates
    start_date = datetime.datetime(2022, 8, 31)
    today = datetime.datetime.today()
    end_date = datetime.datetime.combine(today, datetime.datetime.min.time())

    # Generate a list of dates between start and end dates
    dates = []
    delta = datetime.timedelta(days=1)
    while start_date <= end_date:
        dates.append(start_date)
        start_date += delta

    # Get data for the active users chart
    active_users_per_day = []
    for date in dates:
        thirty_days_ago = date - datetime.timedelta(days=30)
        completed_attempts = ClassAttempt.objects.filter(status='completed', updated_at__gte=thirty_days_ago,
                                                         updated_at__lte=date)
        AU = completed_attempts.values('user').distinct().count()
        active_users_per_day.append(AU)

    # Get the total number of users
    TU = User.objects.count()

    # Get the percentage of active users
    ACT_USE = [(AU / TU) * 100 for AU in active_users_per_day]

    # Create a bar chart for active users per day
    bar_data = [go.Bar(
        x=dates,
        y=active_users_per_day,
        name='Active Users Per Day'
    )]
    bar_layout = go.Layout(
        title='Active Users Per Day',
        xaxis=dict(title='Date'),
        yaxis=dict(title='Number of Active Users')
    )
    bar_fig = go.Figure(data=bar_data, layout=bar_layout)
    bar_plot_div = bar_fig.to_html(full_html=False)

    # Create a line chart for active users over time
    active_users_over_time_data = [go.Scatter(
        x=dates,
        y=active_users_per_day,
        mode='lines+markers',
        name='Active Users'
    )]
    active_users_over_time_layout = go.Layout(
        title='Active Users Over Time',
        xaxis=dict(title='Date'),
        yaxis=dict(title='Number of Active Users')
    )
    active_users_over_time_fig = go.Figure(data=active_users_over_time_data, layout=active_users_over_time_layout)
    active_users_over_time_plot_div = active_users_over_time_fig.to_html(full_html=False)

    # Get data for the active users chart
    class_completed_per_day = []
    for date in dates:
        thirty_days_ago = date - datetime.timedelta(days=30)
        completed_attempts = ClassAttempt.objects.filter(status='completed', updated_at__gte=thirty_days_ago,
                                                         updated_at__lte=date)
        AU = completed_attempts.count()
        class_completed_per_day.append(AU)

    # Get data for the class completed over time chart
    class_completed_over_time_data = [go.Scatter(
        x=dates,
        y=class_completed_per_day,
        mode='lines+markers',
        name='Classes Completed'
    )]
    class_completed_over_time_layout = go.Layout(
        title='Class Completed Over Time',
        xaxis=dict(title='Date'),
        yaxis=dict(title='Classes Completed by All Users')
    )
    class_completed_over_time_fig = go.Figure(data=class_completed_over_time_data,
                                              layout=class_completed_over_time_layout)
    class_completed_over_time_plot_div = class_completed_over_time_fig.to_html(full_html=False)

    payouts = numOfPayouts()

    transactios_amount_over_time_plot_div = payouts

    contract_balance = contractBalance()

    formatted_contract_balance = "{:.2e}".format(contract_balance) + " RBTC"

    # Pass the data to the template
    context = {
        'line_plot_div': line_plot_div,
        'active_users_plot_div': active_users_plot_div,
        'active_users_over_time_plot_div': active_users_over_time_plot_div,
        'class_completed_over_time_plot_div': class_completed_over_time_plot_div,
        'transactios_amount_over_time_plot_div':transactios_amount_over_time_plot_div,
        'formatted_contract_balance':formatted_contract_balance,
        'TU': TU,
        'ACT_USE': ACT_USE,
    }

    # Render the template
    return render(request, 'account/user_graph.html', context)
