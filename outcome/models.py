from django.db import models
from accounts.models import CustomUser
from django.utils.timezone import localdate, now, timedelta

# Create your models here.

class Outcome(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    expense = models.TextField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    day = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user}: {self.amount}"
    
    def calculate(self):
        outcomes = Outcome.objects.filter(user=self.user, day__date=localdate(self.day))
        total = outcomes.aggregate(total=models.Sum('amount'))['total']
        return total or 0.00
    
    def calculate_weekly(self):
        today = now().date()
        start_of_week = today - timedelta(days=today.weekday())
        end_of_week = start_of_week + timedelta(days=6)

        outcomes = Outcome.objects.filter(
            user=self.user,
            day__date__range=[start_of_week, end_of_week]
        )
        total = outcomes.aggregate(total=models.Sum('amount'))['total']
        return total or 0.00
    
    def calculate_monthly(self):
        today = now().date()
        outcomes = Outcome.objects.filter(
            user=self.user,
            day__year=today.year,
            day__month=today.month
        )
        total = outcomes.aggregate(total=models.Sum('amount'))['total']
        return total or 0.00
