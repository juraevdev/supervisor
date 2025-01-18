from rest_framework import serializers
from outcome.models import Outcome

class OutcomeSerializer(serializers.ModelSerializer):
    user = serializers.CharField()
    day = serializers.DateTimeField(format="%Y-%m-%d")

    class Meta:
        model = Outcome
        fields = ['id', 'user', 'expense', 'amount', 'day']


class OutcomeUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Outcome
        fields = ['id', 'expense', 'amount']

    