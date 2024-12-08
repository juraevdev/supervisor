from datetime import datetime, timedelta
from django.db.models.signals import post_save
from django.dispatch import receiver
from celery import current_app
from .models import Todo
from .tasks import send_notification

@receiver(post_save, sender=Todo)
def schedule_notification(sender, instance, **kwargs):
    if instance.planned_time:
        task_time = datetime.combine(datetime.now(), instance.planned_time)
        current_app.send_task(
            'todo.tasks.send_notification',
            args=(instance.id,),
            eta=task_time
        )