from rest_framework import serializers
from outcome.models import Outcome

class OutcomeSerializer(serializers.ModelSerializer):
    user = serializers.CharField()
    day = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')

    class Meta:
        model = Outcome
        fields = ['id', 'user', 'expense', 'amount', 'day']

    