# Generated by Django 4.2 on 2024-11-22 20:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0003_alter_todo_planned_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='todo',
            name='active',
            field=models.BooleanField(default=False),
        ),
    ]
