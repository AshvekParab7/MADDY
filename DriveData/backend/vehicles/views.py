from rest_framework import viewsets, status, generics
from rest_framework.decorators import action, api_view, permission_classes as permission_classes_decorator
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import NotFound
from django.shortcuts import get_object_or_404
from .models import Vehicle, Owner, UserProfile
from .serializers import VehicleSerializer, OwnerSerializer, VehicleScanSerializer, UserRegistrationSerializer, UserProfileSerializer
from .permissions import IsVehicleOwner
from .admin_authentication import AdminJWTAuthentication


class OwnerViewSet(viewsets.ModelViewSet):
    """ViewSet for managing vehicle owners"""
    queryset = Owner.objects.all()
    serializer_class = OwnerSerializer


class VehicleViewSet(viewsets.ModelViewSet):
    """ViewSet for managing vehicles - user can only access their own vehicles"""
    serializer_class = VehicleSerializer
    authentication_classes = [AdminJWTAuthentication]
    permission_classes = [IsVehicleOwner]

    def get_queryset(self):
        """
        Return all vehicles in the registry for list view (search functionality).
        All authenticated users can search and view any vehicle.
        Write permissions (edit/delete) are controlled by IsVehicleOwner permission.
        """
        # All authenticated users can see all vehicles for registry search
        return Vehicle.objects.all().select_related('owner')

    def get_object(self):
        """
        Override get_object to provide custom 404 message when vehicle doesn't exist
        or doesn't belong to user.
        """
        queryset = self.filter_queryset(self.get_queryset())
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        filter_kwargs = {self.lookup_field: self.kwargs[lookup_url_kwarg]}
        
        obj = queryset.filter(**filter_kwargs).first()
        
        if obj is None:
            raise NotFound('Vehicle not found or you do not have permission to access it.')
        
        # Check object permissions
        self.check_object_permissions(self.request, obj)
        
        return obj

    def perform_create(self, serializer):
        """
        Automatically assign the authenticated user as owner when creating a vehicle.
        This prevents users from creating vehicles for other users.
        """
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        """
        Update vehicle - queryset filtering ensures user can only update their own vehicles.
        """
        serializer.save()

    def perform_destroy(self, instance):
        """
        Delete vehicle - queryset filtering ensures user can only delete their own vehicles.
        """
        instance.delete()

    @action(detail=False, methods=['post'], url_path='scan', permission_classes=[AllowAny])
    def scan_qr(self, request):
        """
        Public endpoint to retrieve vehicle information by scanning QR code.
        POST /api/vehicles/scan/
        Body: {"unique_id": "uuid-string"}
        
        Note: This is intentionally public to allow QR code scanning without authentication.
        """
        serializer = VehicleScanSerializer(data=request.data)
        if serializer.is_valid():
            unique_id = serializer.validated_data['unique_id']
            try:
                vehicle = get_object_or_404(Vehicle, unique_id=unique_id)
                vehicle_serializer = VehicleSerializer(vehicle)
                return Response(vehicle_serializer.data, status=status.HTTP_200_OK)
            except Vehicle.DoesNotExist:
                return Response(
                    {'error': 'Vehicle not found with this QR code'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'], url_path='download-logo')
    def download_logo(self, request, pk=None):
        """Download vehicle logo"""
        vehicle = self.get_object()
        if vehicle.logo:
            return Response({
                'logo_url': request.build_absolute_uri(vehicle.logo.url)
            })
        return Response(
            {'error': 'Logo not available'}, 
            status=status.HTTP_404_NOT_FOUND
        )


class UserRegistrationView(generics.CreateAPIView):
    """API view for user registration with photo upload"""
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        """Handle user registration with photo"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            'message': 'User registered successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'photo': request.build_absolute_uri(user.profile.photo.url) if user.profile.photo else None
            }
        }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes_decorator([IsAuthenticated])
def get_user_profile(request):
    """Get current user's profile including photo"""
    user = request.user
    return Response({
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'photo': request.build_absolute_uri(user.profile.photo.url) if user.profile.photo else None
    })
