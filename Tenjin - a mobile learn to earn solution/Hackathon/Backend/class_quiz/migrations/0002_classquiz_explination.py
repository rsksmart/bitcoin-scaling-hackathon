# Generated by Django 4.0.6 on 2023-07-10 15:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('class_quiz', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='classquiz',
            name='description',
            field=models.TextField(blank=True, max_length=255, null=True),
        ),
    ]
