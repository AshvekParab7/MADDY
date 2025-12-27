from rest_framework import permissions


class IsVehicleOwner(permissions.BasePermission):
    """
    Custom permission:
    - Allow read access (GET, HEAD, OPTIONS) to all authenticated users (including admin)
    - Allow write access (POST, PUT, PATCH, DELETE) only to vehicle owners or admin
    """
    message = 'You do not have permission to modify this vehicle.'

    def has_permission(self, request, view):
        """
        Check if user is authenticated or has admin token
        """
        # Check for admin token
        if hasattr(request, 'auth') and request.auth:
            if request.auth.get('role') == 'admin' or request.auth.get('is_admin'):
                return True
        
        # Check for regular user authentication
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        """
        Read permissions are allowed to any authenticated user.
        Write permissions are only allowed to the owner of the vehicle or admin.
        """
        # Check for admin token first
        if hasattr(request, 'auth') and request.auth:
            if request.auth.get('role') == 'admin' or request.auth.get('is_admin'):
                return True
        
        # Allow read-only methods (GET, HEAD, OPTIONS) for all authenticated users
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Admin users (Django staff) can modify all vehicles
        if request.user and hasattr(request.user, 'is_staff') and request.user.is_staff:
            return True
        
        # Regular users can only modify their own vehicles
        return obj.owner == request.user
