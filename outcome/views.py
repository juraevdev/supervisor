from django.shortcuts import render
from rest_framework import generics, status
from outcome.serializers import OutcomeSerializer
from rest_framework.response import Response
from outcome.models import Outcome
# Create your views here.
class OutcomeApiView(generics.GenericAPIView):
    serializer_class = OutcomeSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            outcome = serializer.save()
            total_today = outcome.calculate()
            total_weekly = outcome.calculate_weekly()
            total_monthly = outcome.calculate_monthly()
            return Response({
                'message': 'Outcome saved successfully!',
                'total_today': total_today,
                'total_weekly': total_weekly,
                'total_monthly': total_monthly,
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)