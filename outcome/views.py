from django.shortcuts import render
from django.db import models
from rest_framework import generics, status, permissions
from outcome.serializers import OutcomeSerializer
from rest_framework.response import Response
from outcome.models import Outcome
from django.utils.timezone import now, timedelta, localdate
# Create your views here.
class OutcomeApiView(generics.GenericAPIView):
    serializer_class = OutcomeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            outcome = serializer.save(user=request.user)
            total_today = outcome.calculate()  
            return Response({
                'message': 'Outcome saved successfully!',
                'total_today': total_today,
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    
class OutcomeListApiView(generics.GenericAPIView):
    serializer_class = OutcomeSerializer

    def get(self, request):
        outcome = Outcome.objects.all()
        serializer = self.get_serializer(outcome, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OutcomeUpdateApiView(generics.GenericAPIView):
    serializer_class = OutcomeSerializer

    def put(self, request, id):
        outcome = Outcome.objects.get(id=id)
        serializer = self.get_serializer(outcome, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'message': 'Outcome updated successfully!'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class OutcomeDeleteApiView(generics.GenericAPIView):
    serializer_class = OutcomeSerializer

    def delete(self, request, id):
        outcome = Outcome.objects.get(id=id)
        outcome.delete()
        return Response({'message': 'Outcome deleted successfully!'}, status=status.HTTP_200_OK)


class WeeklyOutcomeApiView(generics.GenericAPIView):
    serializer_class = OutcomeSerializer

    def get(self, request, *args, **kwargs):
        user = request.user
        today = now().date()
        start_of_week = today - timedelta(days=today.weekday())
        end_of_week = start_of_week + timedelta(days=6)

        outcomes = Outcome.objects.filter(
            user=user,
            day__date__range = [start_of_week, end_of_week]
        )
        total = outcomes.aggregate(total=models.Sum('amount'))['total']
        return Response({
            'weekly_total': total or 0.00,
            'outcomes': OutcomeSerializer(outcomes, many=True).data
        }, status=status.HTTP_200_OK)
    
class MonthlyOutcomeApiView(generics.GenericAPIView):
    serializer_class = OutcomeSerializer

    def get(self, request, *args, **kwargs):
        user = request.user
        today = now().date()
        outcomes = Outcome.objects.filter(
            user=user,
            day__year = today.year,
            day__month = today.month
        )
        total = outcomes.aggregate(total=models.Sum('amount'))['total']
        return Response({
            'monthly_total': total or 0.00,
            'outcomes': OutcomeSerializer(outcomes, many=True).data
        }, status=status.HTTP_200_OK) 
    

class DailyOutcomeApiView(generics.GenericAPIView):   
    serializer_class = OutcomeSerializer 
    def get(self, request):
        date = request.GET.get('date', localdate())
        outcomes = Outcome.objects.filter(user=request.user, day__date=date)
        total = outcomes.aggregate(total=models.Sum('amount'))['total']
        return Response({'total': total or 0.00, 'outcomes': OutcomeSerializer(outcomes, many=True).data}, status=status.HTTP_200_OK)