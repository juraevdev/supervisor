from django.urls import path
from django.views.generic import TemplateView
from accounts.views import (
    RegisterApiView,
    RegisterVerifyApiView,
    ResendCodeApiView,
    LoginApiView,
    LogoutApiView,
    PasswordResetRequestApiView,
    PasswordResetVerifyApiView,
    PasswordResetApiView,
    UserProfileApiView,
)

urlpatterns = [
    path('register/', RegisterApiView.as_view()),
    path('register/verify/', RegisterVerifyApiView.as_view()),
    path('register/resend/code/', ResendCodeApiView.as_view()),
    path('login/', LoginApiView.as_view()),
    path('logout/', LogoutApiView.as_view()),
    path('password/request/', PasswordResetRequestApiView.as_view()),
    path('password/verify/', PasswordResetVerifyApiView.as_view()),
    path('password/reset/', PasswordResetApiView.as_view()),
    path('', TemplateView.as_view(template_name='frontend/build/index.html')),
    path('profile/', UserProfileApiView.as_view()),
]