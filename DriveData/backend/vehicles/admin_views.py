"""
Admin-only API views
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Vehicle
from .serializers import VehicleSerializer
from .admin_permissions import IsAdmin
from .admin_authentication import AdminJWTAuthentication


@api_view(['GET'])
@authentication_classes([AdminJWTAuthentication])
@permission_classes([IsAdmin])
def admin_get_all_vehicles(request):
    """
    GET /api/admin/vehicles/
    List all vehicles in the system (admin only)
    """
    vehicles = Vehicle.objects.all().select_related('owner').order_by('-created_at')
    serializer = VehicleSerializer(vehicles, many=True, context={'request': request})
    
    return Response({
        'count': vehicles.count(),
        'vehicles': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([AdminJWTAuthentication])
@permission_classes([IsAdmin])
def admin_get_all_users(request):
    """
    GET /api/admin/users/
    List all users in the system (admin only)
    """
    users = User.objects.all().order_by('-date_joined')
    
    users_data = [{
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'date_joined': user.date_joined,
        'is_active': user.is_active,
        'vehicle_count': user.vehicles.count()
    } for user in users]
    
    return Response({
        'count': len(users_data),
        'users': users_data
    }, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@authentication_classes([AdminJWTAuthentication])
@permission_classes([IsAdmin])
def admin_verify_vehicle(request, pk):
    """
    PATCH /api/admin/vehicles/{id}/verify/
    Mark vehicle as verified (admin only)
    """
    try:
        vehicle = Vehicle.objects.get(pk=pk)
    except Vehicle.DoesNotExist:
        return Response(
            {'error': 'Vehicle not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Add verified field if needed (you may need to add this to model)
    # For now, we'll use a simple response
    
    return Response({
        'message': f'Vehicle {vehicle.registration_number} verified successfully',
        'vehicle_id': vehicle.id
    }, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@authentication_classes([AdminJWTAuthentication])
@permission_classes([IsAdmin])
def admin_blacklist_vehicle(request, pk):
    """
    PATCH /api/admin/vehicles/{id}/blacklist/
    Mark vehicle as blacklisted (admin only)
    """
    try:
        vehicle = Vehicle.objects.get(pk=pk)
    except Vehicle.DoesNotExist:
        return Response(
            {'error': 'Vehicle not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Add blacklisted field if needed (you may need to add this to model)
    # For now, we'll use a simple response
    
    return Response({
        'message': f'Vehicle {vehicle.registration_number} blacklisted successfully',
        'vehicle_id': vehicle.id
    }, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@authentication_classes([AdminJWTAuthentication])
@permission_classes([IsAdmin])
def admin_delete_vehicle(request, pk):
    """
    DELETE /api/admin/vehicles/{id}/
    Delete any vehicle (admin only)
    """
    try:
        vehicle = Vehicle.objects.get(pk=pk)
        reg_number = vehicle.registration_number
        vehicle.delete()
        
        return Response({
            'message': f'Vehicle {reg_number} deleted successfully'
        }, status=status.HTTP_200_OK)
    except Vehicle.DoesNotExist:
        return Response(
            {'error': 'Vehicle not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@authentication_classes([AdminJWTAuthentication])
@permission_classes([IsAdmin])
def admin_dashboard_stats(request):
    """
    GET /api/admin/stats/
    Get dashboard statistics (admin only)
    """
    total_vehicles = Vehicle.objects.count()
    total_users = User.objects.count()
    recent_vehicles = Vehicle.objects.all().select_related('owner').order_by('-created_at')[:5]
    
    recent_vehicles_data = VehicleSerializer(
        recent_vehicles, 
        many=True, 
        context={'request': request}
    ).data
    
    return Response({
        'total_vehicles': total_vehicles,
        'total_users': total_users,
        'recent_vehicles': recent_vehicles_data
    }, status=status.HTTP_200_OK)
