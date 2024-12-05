from django.contrib import admin 
from outcome.models import Outcome

@admin.register(Outcome)
class OutcomeAdmin(admin.ModelAdmin):
    pass
