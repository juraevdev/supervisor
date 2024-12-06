from django.urls import path
from outcome.views import (
    OutcomeApiView,
    OutcomeListApiView,
    OutcomeUpdateApiView,
    OutcomeDeleteApiView,
    WeeklyOutcomeApiView,
    MonthlyOutcomeApiView
)

urlpatterns = [
    path('outcome/', OutcomeApiView.as_view()),
    path('outcome/all/', OutcomeListApiView.as_view()),
    path('outcome/edit/<int:id>/', OutcomeUpdateApiView.as_view()),
    path('outcomes/delete/<int:id>/', OutcomeDeleteApiView.as_view()),
    path('weekly/', WeeklyOutcomeApiView.as_view()),
    path('monthly/', MonthlyOutcomeApiView.as_view()),
]