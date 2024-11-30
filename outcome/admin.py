from django.contrib import admin
from outcome.models import Outcome

# Register your models here.
@admin.register(Outcome)
class OutcomeAdmin(admin.ModelAdmin):
    pass 
