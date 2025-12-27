from django.contrib import admin
from .models import Vehicle, Owner

@admin.register(Owner)
class OwnerAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'created_at']
    search_fields = ['name', 'email', 'phone']
    list_filter = ['created_at']

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ['registration_number', 'make', 'model', 'year', 'owner', 'insurance_expiry', 'created_at']
    search_fields = ['registration_number', 'make', 'model', 'owner__name']
    list_filter = ['make', 'year', 'fuel_type', 'created_at']
    readonly_fields = ['qr_code', 'unique_id']
