# Generated by Django 3.2.5 on 2023-05-05 11:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_auto_20230505_1114'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trial',
            name='is_on_trial',
            field=models.BooleanField(default=True),
        ),
    ]
