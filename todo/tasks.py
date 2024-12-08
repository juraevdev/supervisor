from celery import shared_task
from datetime import datetime, timedelta
from .models import Todo
from django.core.mail import send_mail

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

@shared_task
def send_notification(todo_id):
    try:
        todo = Todo.objects.get(id=todo_id)
        send_mail(
            subject=f"Reminder: {todo.name}",
            message=f"It is time to do your task: {todo.name}",
            from_email='noreply@juraevdevpy@gmail.com',
            recipient_list=[todo.author.email],
        )
    except Todo.DoesNotExist:
        print("Todo not found")
        