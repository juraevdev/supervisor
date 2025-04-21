import random
import datetime
from django.db import models
from django.utils import timezone
from django.core.mail import send_mail
from django.contrib.auth.models import AbstractUser
from accounts.managers import CustomUserManager
from django.conf import settings


class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=30, unique=True)
    email = models.EmailField(unique=True)
    username = None
    objects = CustomUserManager()
    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'email']

    def __str__(self):
        return self.first_name

    def generate_verify_code(self):
        code = ''.join(str(random.randint(0, 9)) for _ in range(5))
        UserConfirmation.objects.create(
            user=self,
            code=code,
            expires=timezone.now() + datetime.timedelta(minutes=2)
        )

        send_mail(
            'Email verification code',
            f'Your verification code is: {code}',
            settings.EMAIL_HOST_USER,
            [self.email],
            fail_silently=False,
        )

        return code


class UserConfirmation(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    code = models.CharField(max_length=5)
    expires = models.DateTimeField(null=True, blank=True)
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user} - {self.code}"
