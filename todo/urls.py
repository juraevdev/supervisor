from django.urls import path
from todo.views import (
    TodoCreateApiView, TodoListApiView,
    TodoUpdateApiView, TodoDeleteApiView,
    TodoDetailApiView
)


urlpatterns = [
    path('create/', TodoCreateApiView.as_view()),
    path('all-todos/', TodoListApiView.as_view()),
    path('<int:id>/edit/', TodoUpdateApiView.as_view()),
    path('<int:id>/', TodoDetailApiView.as_view()),
    path('delete/<int:id>/', TodoDeleteApiView.as_view()),
]