from .models import Todo
from .serializers import TodoSerializer, TodoCreateSerializer
from rest_framework import generics, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

class TodoCreateApiView(generics.GenericAPIView):
    serializer_class = TodoCreateSerializer

    def post(self, request):
        user = request.user
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(author=user)
            return Response({'message': 'Todo created successfully!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class TodoListApiView(generics.GenericAPIView):
    serializer_class = TodoSerializer

    def get(self, request):
        user = request.user
        todos = Todo.objects.filter(author=user)
        serializer = self.get_serializer(todos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class TodoDetailApiView(generics.GenericAPIView):
    serializer_class = TodoSerializer

    def get(self, request, id):
        user = request.user
        todo = get_object_or_404(Todo, id=id, author=user)
        serializer = self.get_serializer(todo)
        return Response(serializer.data)
    
class TodoUpdateApiView(generics.GenericAPIView):
    serializer_class = TodoSerializer

    def put(self, request, id):
        user = request.user
        todo = get_object_or_404(Todo, id=id, author=user)
        serializer = self.get_serializer(todo, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Todo edited successfully!'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class TodoDeleteApiView(generics.GenericAPIView):
    serializer_class = TodoSerializer

    def delete(self, request, id):
        user = request.user
        todo = get_object_or_404(Todo, id=id, author=user)
        todo.delete()
        return Response({'message': 'Todo deleted'}, status=status.HTTP_200_OK)
