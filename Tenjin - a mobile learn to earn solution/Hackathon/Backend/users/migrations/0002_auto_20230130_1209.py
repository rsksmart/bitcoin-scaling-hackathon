# Generated by Django 3.2.5 on 2023-01-30 12:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='given_referral_code',
            field=models.CharField(blank=True, max_length=20),
        ),
        migrations.AddField(
            model_name='user',
            name='personal_referral_code',
            field=models.CharField(blank=True, default='', max_length=20),
        ),
    ]
