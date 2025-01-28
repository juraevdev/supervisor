from django.db import models
from accounts.models import CustomUser
from datetime import timedelta
import datetime

# Create your models here.
class Todo(models.Model):
    name = models.CharField(max_length=255)
    planned_time = models.TimeField(null=True, blank=True)
    date_addeed = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True)
    active = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name}-{self.author}"

    # def todo_expires(self):
    #     expires = Todo.objects.filter(
    #         planned_time__lte=datetime.now() + timedelta(days=1)
    #     )
    #     return expires

    # def todo_start(self):
    #     start = Todo.objects.filter(
    #         planned_time__lte = datetime.now()
    #     )
    #     return start