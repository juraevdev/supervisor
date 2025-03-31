from django.db import models
from accounts.models import CustomUser
from datetime import timedelta
import datetime

# Create your models here.
class Todo(models.Model):
    name = models.CharField(max_length=255)
    date_addeed = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True)
    active = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name}-{self.author}"
