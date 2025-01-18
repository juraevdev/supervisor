from django.db import models
from rest_framework import generics, status, permissions
from outcome.serializers import OutcomeSerializer, OutcomeUpdateSerializer
from rest_framework.response import Response
from outcome.models import Outcome
from django.utils.timezone import now, timedelta, make_aware, datetime
from django.utils.dateparse import parse_date
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

    def get(self, request, *args, **kwargs):
        user = request.user
        outcomes = Outcome.objects.all()
        total = outcomes.aggregate(total=models.Sum('amount'))['total']
        return Response({
            'total': total or 0.00,
            'outcomes': OutcomeSerializer(outcomes, many=True).data
        }, status=status.HTTP_200_OK)


class OutcomeUpdateApiView(generics.GenericAPIView):
    serializer_class = OutcomeUpdateSerializer

    def put(self, request, id):
        user = request.user
        outcome = Outcome.objects.get(id=id)
        serializer = self.get_serializer(outcome, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'message': 'Outcome updated successfully!'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class OutcomeDeleteApiView(generics.GenericAPIView):
    serializer_class = OutcomeSerializer

    def delete(self, request, id, *args, **kwargs):
        try:
            outcome = Outcome.objects.get(id=id)
            outcome.delete()
            return Response({'message': 'Outcome deleted successfully!'}, status=status.HTTP_200_OK)
        except Outcome.DoesNotExist:
            return Response({'error': 'Outcome not found!'}, status=status.HTTP_404_NOT_FOUND)


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

    def get(self, request, *args, **kwargs):
        user = request.user
        today = now().date()
        outcomes = Outcome.objects.filter(
            user=user,
            day__date=today
        )
        total = outcomes.aggregate(total=models.Sum('amount'))['total']
        return Response({
            'total': total or 0.00,
            'outcomes': OutcomeSerializer(outcomes, many=True).data
        }, status=status.HTTP_200_OK)

class OutcomeListDateApiView(generics.GenericAPIView):
    serializer_class = OutcomeSerializer

    def get(self, request, *args, **kwargs):
        user = request.user
        date = request.GET.get('date')
        outcomes = Outcome.objects.all()

        if date:
            try:
                parsed_date = parse_date(date)
                if parsed_date:
                    parsed_date = make_aware(datetime.combine(parsed_date, datetime.min.time()))
                    start_of_day = parsed_date.replace(hour=0, minute=0, second=0, microsecond=0)
                    end_of_day = parsed_date.replace(hour=23, minute=59, second=59, microsecond=999999)
                    outcomes = outcomes.filter(day__range=[start_of_day, end_of_day])
                else:
                    return Response({'error': 'Invalid date format. Use YYYY-MM-DD format.'}, status=status.HTTP_400_BAD_REQUEST)
            except ValueError:
                return Response({'error': 'Invalid date format. Use YYYY-MM-DD format.'}, status=status.HTTP_400_BAD_REQUEST)


        total = outcomes.aggregate(total=models.Sum('amount'))['total']
        return Response({
            'total': total or 0.00,
            'outcomes': OutcomeSerializer(outcomes, many=True).data
        }, status=status.HTTP_200_OK)