from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Vehicle, Owner


class OwnerSerializer(serializers.ModelSerializer):
    """Serializer for Owner model"""
    class Meta:
        model = Owner
        fields = ['id', 'name', 'email', 'phone', 'address', 'photo', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class VehicleSerializer(serializers.ModelSerializer):
    """Serializer for Vehicle model"""
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    
    class Meta:
        model = Vehicle
        fields = [
            'id', 'unique_id', 'registration_number', 'make', 'model', 
            'year', 'color', 'fuel_type', 'engine_number', 'chassis_number',
            'owner_username', 'owner_name', 'owner_email', 'owner_phone', 
            'owner_address', 'owner_photo',
            'insurance_expiry', 'pollution_certificate_expiry', 'registration_date',
            'front_photo', 'back_photo', 'side_photo', 
            'qr_code', 'logo', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'unique_id', 'qr_code', 'logo', 'created_at', 'updated_at', 'owner_username', 'owner']


class VehicleScanSerializer(serializers.Serializer):
    """Serializer for QR code scanning"""
    unique_id = serializers.UUIDField()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration with photo upload"""
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'}, label='Confirm Password')
    photo = serializers.ImageField(write_only=True, required=False, allow_null=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name', 'photo']
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': False},
            'last_name': {'required': False}
        }
    
    def validate(self, attrs):
        """Validate password match and email uniqueness"""
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists."})
        
        return attrs
    
    def create(self, validated_data):
        """Create new user with hashed password and profile photo"""
        validated_data.pop('password2')
        photo = validated_data.pop('photo', None)
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        
        # Update profile photo if provided
        if photo:
            user.profile.photo = photo
            user.profile.save()
        
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile data"""
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    
    class Meta:
        model = User.profile.related.related_model  # UserProfile
        fields = ['username', 'email', 'first_name', 'last_name', 'photo', 'phone', 'bio']
        read_only_fields = ['username', 'email', 'first_name', 'last_name']
