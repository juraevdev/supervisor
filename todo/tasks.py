from celery import shared_task
from datetime import datetime, timedelta
from .models import Todo

@shared_task
def deactivate_expired_todos():
    expired_todos = Todo.objects.filter(
        planned_time__lte=datetime.now() - timedelta(days=1),
        active=True
    )
    for todo in expired_todos:
        todo.active = False
        todo.delete()

@shared_task
def activate_todos_at_planned_time():
    todos_to_activate = Todo.objects.filter(
        planned_time__lte=datetime.now(),
        active=False
    )
    for todo in todos_to_activate:
        todo.active = True
        todo.save()

