from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery import shared_task
from datetime import datetime, timedelta

# Django sozlamalarini belgilash
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('config')
import django
django.setup()

# Django sozlamalaridan Celery konfiguratsiyasini yuklash
app.config_from_object('django.conf:settings', namespace='CELERY')

# Django app’larning vazifalarini avtomatik yuklash
app.autodiscover_tasks()