from celery import shared_task
from django.utils.timezone import now, timedelta
from .models import Todo
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

import logging
logger = logging.getLogger(__name__)

@shared_task
def deactivate_expired_todos():
    expired_todos = Todo.objects.filter(
        planned_time__lte=now() - timedelta(days=1),
        active=True
    )
    logger.info(f"Found {expired_todos.count()} expired todos.")
    for todo in expired_todos:
        todo_id = todo.id
        todo.delete()
        logger.info(f"Todo {todo_id} deactivated.")

@shared_task
def activate_todos_at_planned_time():
    todos_to_notify = Todo.objects.filter(
        planned_time__lte=now(),
        active=False
    )
    logger.info(f"{todos_to_notify.count()} todos found for activation.")
    for todo in todos_to_notify:
        try:
            todo.active = True
            todo.save()
            send_notification.delay(todo.id)
            logger.info(f"Todo {todo.id} activated and notification sent.")
        except Exception as e:
            logger.error(f"Error activating todo {todo.id}: {str(e)}")

@shared_task
def send_notification(todo_id):
    try:
        todo = Todo.objects.get(id=todo_id)
    except Todo.DoesNotExist:
        logger.error(f"Todo with ID {todo_id} does not exist.")
        return

    channel_layer = get_channel_layer()
    try:
        async_to_sync(channel_layer.group_send)(
            f"user_{todo.author.id}",
            {
                "type": "send_notification",
                "message": f"It is time to: {todo.name}",
            }
        )
        logger.info(f"Notification sent for todo {todo.id}.")
    except Exception as e:
        logger.error(f"Failed to send notification for todo {todo.id}: {str(e)}")