from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery import shared_task
from datetime import datetime, timedelta

# Django sozlamalarini belgilash
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('supervisor')
import django
django.setup()

# Django sozlamalaridan Celery konfiguratsiyasini yuklash
app.config_from_object('django.conf:settings', namespace='CELERY')

# Django app’larning vazifalarini avtomatik yuklash
app.autodiscover_tasks()

@shared_task
def deactivate_expired_todos():
    from todo.models import Todo
    expired_todos = Todo.objects.filter(
        planned_time__lte=datetime.now() - timedelta(days=1),
        active=True
    )
    for todo in expired_todos:
        todo.active = False
        todo.delete()

@shared_task
def activate_todos_at_planned_time():
    from todo.models import Todo
    todos_to_activate = Todo.objects.filter(
        planned_time__lte=datetime.now(),
        active=False
    )
    for todo in todos_to_activate:
        todo.active = True
        todo.save()
 