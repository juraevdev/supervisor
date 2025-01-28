from .models import Todo
from rest_framework import serializers

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ['name', 'planned_time', 'author']

class TodoCreateSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Todo
        fields = ['name', 'planned_time']

