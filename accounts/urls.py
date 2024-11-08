from django.urls import path
from accounts.views import (
    RegisterApiView,
    RegisterVerifyApiView,
    ResendCodeApiView,
    LoginApiView,
    LogoutApiView,
    PasswordResetRequestApiView,
    PasswordResetVerifyApiView,
    PasswordResetApiView
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
]