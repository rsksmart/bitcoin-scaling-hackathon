# Generated by Django 4.0.6 on 2023-07-11 10:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_user_email_sent'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Trial',
        ),
    ]
