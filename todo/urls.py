from django.urls import path, re_path
from . import consumers
from . import views

websocket_urlpatterns = [
    re_path(r'ws/notifications/$', consumers.NotificationConsumer.as_asgi()),
]

urlpatterns = [
    path('create/', views.TodoCreateApiView.as_view()),
    path('all-todos/', views.TodoListApiView.as_view()),
    path('<int:id>/edit/', views.TodoUpdateApiView.as_view()),
    path('<int:id>/', views.TodoDetailApiView.as_view()),
    path('delete/<int:id>/', views.TodoDeleteApiView.as_view()),
]