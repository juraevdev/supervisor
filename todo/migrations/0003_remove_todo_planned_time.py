# Generated by Django 4.2 on 2025-02-24 21:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0002_alter_todo_author'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='todo',
            name='planned_time',
        ),
    ]
