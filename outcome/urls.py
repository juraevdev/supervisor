from django.urls import path
from outcome.views import OutcomeApiView

urlpatterns = [
    path('outcome/', OutcomeApiView.as_view()),
]