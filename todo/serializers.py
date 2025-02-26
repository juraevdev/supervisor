from .models import Todo
from rest_framework import serializers

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ['name', 'author']

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['author'] = request.user
        return super().create(validated_data)

class TodoCreateSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Todo
        fields = ['name', ]

