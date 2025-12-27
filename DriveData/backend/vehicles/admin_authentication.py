"""
Custom JWT Authentication for Admin
Allows tokens without user_id (admin tokens)
"""
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed


class AdminJWTAuthentication(JWTAuthentication):
    """
    Custom JWT authentication that allows admin tokens without user_id
    """
    
    def get_user(self, validated_token):
        """
        Override to allow tokens with role=admin but no user_id
        """
        # Check if this is an admin token
        if validated_token.get('role') == 'admin' or validated_token.get('is_admin'):
            # Return None for user, but allow the token to be valid
            # The permission class will check the role
            return None
        
        # For regular user tokens, use the default behavior
        try:
            return super().get_user(validated_token)
        except Exception:
            # If user lookup fails but token is valid, return None
            return None
