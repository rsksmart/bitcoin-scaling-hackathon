# Generated by Django 3.2.5 on 2023-01-16 14:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_statistic_status', '0002_userstatisticstatus_level'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userstatisticstatus',
            name='level',
            field=models.PositiveIntegerField(blank=True, default=1, null=True),
        ),
    ]
