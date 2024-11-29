from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.TodoCreateApiView.as_view()),
    path('all-todos/', views.TodoListApiView.as_view()),
    path('<int:id>/edit/', views.TodoUpdateApiView.as_view()),
    path('<int:id>/', views.TodoDetailApiView.as_view()),
    path('delete/<int:id>/', views.TodoDeleteApiView.as_view()),
]