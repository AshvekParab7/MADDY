"""
Dashboard Views for DriveData
Provides API endpoints for dashboard statistics, expiry alerts, and vehicle lists
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import date, timedelta
from django.db.models import Q
from .models import Vehicle
from .dashboard_serializers import (
    DashboardStatsSerializer,
    ExpiryAlertSerializer,
    MyVehicleSerializer
)


class DashboardStatsView(APIView):
    """
    GET /api/dashboard/stats/
    
    Returns overview statistics for dashboard cards:
    - Total vehicles count
    - Vehicles with documents expiring soon (within 30 days)
    - Vehicles with expired documents
    - Active QR codes count
    """
    
    def get(self, request):
        # Calculate date thresholds
        today = date.today()
        expiry_threshold = today + timedelta(days=30)  # 30 days from now
        
        # Filter vehicles by authenticated user (admin users see all vehicles)
        if request.user.is_staff:
            user_vehicles = Vehicle.objects.all()
        else:
            user_vehicles = Vehicle.objects.filter(owner=request.user)
        
        # Total vehicles
        total_vehicles = user_vehicles.count()
        
        # Count vehicles with expiring documents (within 30 days)
        # Check both insurance and pollution certificate
        expiring_soon = user_vehicles.filter(
            Q(insurance_expiry__lte=expiry_threshold, insurance_expiry__gt=today) |
            Q(pollution_certificate_expiry__lte=expiry_threshold, pollution_certificate_expiry__gt=today)
        ).distinct().count()
        
        # Count vehicles with expired documents
        expired = user_vehicles.filter(
            Q(insurance_expiry__lt=today) |
            Q(pollution_certificate_expiry__lt=today)
        ).distinct().count()
        
        # Count vehicles with active QR codes
        active_qr = user_vehicles.exclude(qr_code='').count()
        
        # Prepare response data
        stats = {
            'total_vehicles': total_vehicles,
            'expiring_soon_count': expiring_soon,
            'expired_count': expired,
            'active_qr_count': active_qr,
        }
        
        serializer = DashboardStatsSerializer(stats)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ExpiryAlertsView(APIView):
    """
    GET /api/dashboard/expiries/
    
    Returns list of all vehicles with their expiry status
    Includes:
    - Vehicle registration number
    - Insurance expiry date and status
    - Pollution certificate expiry date and status
    - Overall status (red/yellow/green)
    - Days remaining for each document
    """
    
    def get(self, request):
        # Get user's vehicles ordered by earliest expiry date first (admin users see all vehicles)
        if request.user.is_staff:
            vehicles = Vehicle.objects.all().order_by('insurance_expiry')
        else:
            vehicles = Vehicle.objects.filter(owner=request.user).order_by('insurance_expiry')
        
        # Serialize the data (status calculation happens in serializer)
        serializer = ExpiryAlertSerializer(vehicles, many=True, context={'request': request})
        
        return Response(serializer.data, status=status.HTTP_200_OK)


class MyVehiclesView(APIView):
    """
    GET /api/dashboard/my-vehicles/
    
    Returns compact list of user's vehicles with:
    - Vehicle number and make/model
    - QR code status (Active/Inactive)
    - QR code download URL
    - Logo download URL
    - Public page URL for sharing
    """
    
    def get(self, request):
        # Get user's vehicles ordered by most recently created (admin users see all vehicles)
        if request.user.is_staff:
            vehicles = Vehicle.objects.all().order_by('-created_at')
        else:
            vehicles = Vehicle.objects.filter(owner=request.user).order_by('-created_at')
        
        # Serialize with request context for building absolute URLs
        serializer = MyVehicleSerializer(vehicles, many=True, context={'request': request})
        
        return Response(serializer.data, status=status.HTTP_200_OK)


class DashboardAlertsSummaryView(APIView):
    """
    GET /api/dashboard/alerts-summary/
    
    Returns a quick summary of urgent alerts:
    - Vehicles expiring this week
    - Vehicles expiring this month
    - Already expired vehicles
    """
    
    def get(self, request):
        today = date.today()
        week_from_now = today + timedelta(days=7)
        month_from_now = today + timedelta(days=30)
        
        # Filter by authenticated user (admin users see all vehicles)
        if request.user.is_staff:
            user_vehicles = Vehicle.objects.all()
        else:
            user_vehicles = Vehicle.objects.filter(owner=request.user)
        
        # Vehicles expiring within a week
        expiring_this_week = user_vehicles.filter(
            Q(insurance_expiry__lte=week_from_now, insurance_expiry__gt=today) |
            Q(pollution_certificate_expiry__lte=week_from_now, pollution_certificate_expiry__gt=today)
        ).distinct()
        
        # Vehicles expiring within a month (but not this week)
        expiring_this_month = user_vehicles.filter(
            Q(insurance_expiry__lte=month_from_now, insurance_expiry__gt=week_from_now) |
            Q(pollution_certificate_expiry__lte=month_from_now, pollution_certificate_expiry__gt=week_from_now)
        ).distinct()
        
        # Already expired vehicles
        already_expired = user_vehicles.filter(
            Q(insurance_expiry__lt=today) |
            Q(pollution_certificate_expiry__lt=today)
        ).distinct()
        
        summary = {
            'expiring_this_week': ExpiryAlertSerializer(expiring_this_week, many=True, context={'request': request}).data,
            'expiring_this_month': ExpiryAlertSerializer(expiring_this_month, many=True, context={'request': request}).data,
            'already_expired': ExpiryAlertSerializer(already_expired, many=True, context={'request': request}).data,
            'counts': {
                'this_week': expiring_this_week.count(),
                'this_month': expiring_this_month.count(),
                'expired': already_expired.count(),
            }
        }
        
        return Response(summary, status=status.HTTP_200_OK)
