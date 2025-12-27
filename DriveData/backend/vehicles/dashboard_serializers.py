"""
Dashboard Serializers for DriveData
Provides data formatting and expiry status calculation for dashboard widgets
"""

from rest_framework import serializers
from .models import Vehicle
from datetime import date, timedelta


class DashboardStatsSerializer(serializers.Serializer):
    """
    Serializer for dashboard overview statistics
    Returns counts for total vehicles, expiring, and expired documents
    """
    total_vehicles = serializers.IntegerField()
    expiring_soon_count = serializers.IntegerField()
    expired_count = serializers.IntegerField()
    active_qr_count = serializers.IntegerField()


class ExpiryAlertSerializer(serializers.ModelSerializer):
    """
    Serializer for expiry alerts table
    Calculates status based on insurance and pollution certificate expiry dates
    """
    vehicle_number = serializers.CharField(source='registration_number')
    insurance_status = serializers.SerializerMethodField()
    pollution_status = serializers.SerializerMethodField()
    overall_status = serializers.SerializerMethodField()
    insurance_days_remaining = serializers.SerializerMethodField()
    pollution_days_remaining = serializers.SerializerMethodField()

    class Meta:
        model = Vehicle
        fields = [
            'id',
            'vehicle_number',
            'insurance_expiry',
            'pollution_certificate_expiry',
            'insurance_status',
            'pollution_status',
            'overall_status',
            'insurance_days_remaining',
            'pollution_days_remaining',
        ]

    def get_status(self, expiry_date):
        """
        Calculate status based on days remaining
        Returns: 'green', 'yellow', or 'red'
        
        Logic:
        - Green: More than 30 days remaining
        - Yellow: 1 to 30 days remaining
        - Red: Expired (0 or negative days)
        """
        if not expiry_date:
            return 'red'
        
        today = date.today()
        days_remaining = (expiry_date - today).days
        
        if days_remaining > 30:
            return 'green'
        elif days_remaining >= 1:
            return 'yellow'
        else:
            return 'red'
    
    def get_days_remaining(self, expiry_date):
        """Calculate days remaining until expiry"""
        if not expiry_date:
            return None
        
        today = date.today()
        days_remaining = (expiry_date - today).days
        return days_remaining

    def get_insurance_status(self, obj):
        """Get status for insurance expiry"""
        return self.get_status(obj.insurance_expiry)
    
    def get_pollution_status(self, obj):
        """Get status for pollution certificate expiry"""
        return self.get_status(obj.pollution_certificate_expiry)
    
    def get_overall_status(self, obj):
        """
        Get overall status - returns worst status between insurance and pollution
        Priority: Red > Yellow > Green
        """
        insurance_status = self.get_status(obj.insurance_expiry)
        pollution_status = self.get_status(obj.pollution_certificate_expiry)
        
        if insurance_status == 'red' or pollution_status == 'red':
            return 'red'
        elif insurance_status == 'yellow' or pollution_status == 'yellow':
            return 'yellow'
        else:
            return 'green'
    
    def get_insurance_days_remaining(self, obj):
        """Get days remaining for insurance"""
        return self.get_days_remaining(obj.insurance_expiry)
    
    def get_pollution_days_remaining(self, obj):
        """Get days remaining for pollution certificate"""
        return self.get_days_remaining(obj.pollution_certificate_expiry)


class MyVehicleSerializer(serializers.ModelSerializer):
    """
    Serializer for My Vehicles mini list in dashboard
    Provides quick access to vehicle info, QR codes, and public page
    """
    vehicle_number = serializers.CharField(source='registration_number')
    qr_status = serializers.SerializerMethodField()
    qr_download_url = serializers.SerializerMethodField()
    logo_download_url = serializers.SerializerMethodField()
    public_page_url = serializers.SerializerMethodField()
    make_model = serializers.SerializerMethodField()

    class Meta:
        model = Vehicle
        fields = [
            'id',
            'vehicle_number',
            'make_model',
            'qr_status',
            'qr_download_url',
            'logo_download_url',
            'public_page_url',
        ]

    def get_qr_status(self, obj):
        """Check if QR code exists - returns 'Active' or 'Inactive'"""
        return 'Active' if obj.qr_code else 'Inactive'
    
    def get_qr_download_url(self, obj):
        """Get full URL for QR code download"""
        if obj.qr_code:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.qr_code.url)
        return None
    
    def get_logo_download_url(self, obj):
        """Get full URL for logo download"""
        if obj.logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.logo.url)
        return None
    
    def get_public_page_url(self, obj):
        """Generate URL for public vehicle details page"""
        request = self.context.get('request')
        if request:
            # Frontend URL - adjust port if needed
            return f"http://localhost:5174/vehicle/{obj.id}"
        return None
    
    def get_make_model(self, obj):
        """Combine make and model for display"""
        return f"{obj.make} {obj.model}"
