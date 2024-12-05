from rest_framework import serializers
from outcome.models import Outcome

class OutcomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Outcome
        fields = '__all__'

    