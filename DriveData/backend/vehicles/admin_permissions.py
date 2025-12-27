"""
Admin-only permission class
"""
from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """
    Custom permission to only allow admin users.
    Checks JWT token for role='admin'
    """
    message = 'Admin access required. You do not have permission to perform this action.'

    def has_permission(self, request, view):
        """
        Check if the user has admin role in JWT token
        """
        # Check if token has admin role
        # The JWT token payload is accessible via request.auth
        if hasattr(request, 'auth') and request.auth:
            # For SimpleJWT, check the token payload
            try:
                role = request.auth.get('role')
                is_admin = request.auth.get('is_admin')
                
                # Admin token must have role='admin' or is_admin=True
                if role == 'admin' or is_admin == True:
                    return True
            except (AttributeError, TypeError):
                pass
        
        # Fallback: check if authenticated user is staff (Django admin)
        if request.user and hasattr(request.user, 'is_authenticated'):
            if request.user.is_authenticated:
                return getattr(request.user, 'is_staff', False)
        
        return False
