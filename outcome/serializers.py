from rest_framework import serializers
from outcome.models import Outcome

class OutcomeSerializer(serializers.Serializer):
    expense = serializers.CharField()
    amount = serializers.DecimalField()

    def calculate_expenses(self, request):
        outcome = Outcome.objects.filter()