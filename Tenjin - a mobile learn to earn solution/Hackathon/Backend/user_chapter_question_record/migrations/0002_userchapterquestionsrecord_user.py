# Generated by Django 3.2.5 on 2022-12-13 16:55

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('user_chapter_question_record', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='userchapterquestionsrecord',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user_chapter_question_record', to=settings.AUTH_USER_MODEL),
        ),
    ]
