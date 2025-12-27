"""
Admin Authentication System
Fixed admin credentials (not using User model)
"""
import os
from rest_framework import serializers, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import timedelta


# Fixed admin credentials
ADMIN_USERNAME = os.getenv('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'admin@123')


class AdminLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


def get_admin_tokens(username):
    """Generate JWT tokens for admin with role=admin"""
    refresh = RefreshToken()
    refresh['username'] = username
    refresh['role'] = 'admin'
    refresh['is_admin'] = True
    
    # Set custom lifetime
    refresh.access_token.set_exp(lifetime=timedelta(hours=24))
    
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    """
    Admin login endpoint
    POST /api/admin/login/
    """
    serializer = AdminLoginSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(
            {'error': 'Invalid input'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    username = serializer.validated_data['username']
    password = serializer.validated_data['password']
    
    # Validate admin credentials
    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        tokens = get_admin_tokens(username)
        return Response({
            'message': 'Admin login successful',
            'username': username,
            'role': 'admin',
            **tokens
        }, status=status.HTTP_200_OK)
    
    return Response(
        {'error': 'Invalid admin credentials'},
        status=status.HTTP_401_UNAUTHORIZED
    )
