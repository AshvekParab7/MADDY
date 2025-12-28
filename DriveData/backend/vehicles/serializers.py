from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Vehicle, Owner


class OwnerSerializer(serializers.ModelSerializer):
    """Serializer for Owner model"""

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if representation.get('photo'):
            value = getattr(instance, 'photo')
            representation['photo'] = value.url if value else None
        return representation

    class Meta:
        model = Owner
        fields = [
            'id', 'name', 'email', 'phone',
            'address', 'photo', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class VehicleSerializer(serializers.ModelSerializer):
    """Serializer for Vehicle model"""

    # ✅ AUTO-ATTACH LOGGED-IN USER (FIXES ADD VEHICLE ERROR)
    owner = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )

    owner_username = serializers.CharField(
        source='owner.username',
        read_only=True
    )

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        cloudinary_fields = [
            'owner_photo',
            'front_photo',
            'back_photo',
            'side_photo',
            'qr_code',
            'logo'
        ]

        for field in cloudinary_fields:
            value = getattr(instance, field, None)
            # Check if field has a value and a URL
            if value and hasattr(value, 'url'):
                try:
                    representation[field] = value.url
                except:
                    representation[field] = None
            else:
                representation[field] = None

        return representation

    class Meta:
        model = Vehicle
        fields = [
            'id',
            'unique_id',
            'owner', 
            'registration_number',
            'make',
            'model',
            'year',
            'color',
            'fuel_type',
            'engine_number',
            'chassis_number',

            'owner_username',
            'owner_name',
            'owner_email',
            'owner_phone',
            'owner_address',
            'owner_photo',

            'insurance_expiry',
            'pollution_certificate_expiry',
            'registration_date',

            'front_photo',
            'back_photo',
            'side_photo',

            'qr_code',
            'logo',

            'created_at',
            'updated_at',
        ]

        read_only_fields = [
            'id',
            'unique_id',
            'qr_code',
            'logo',
            'created_at',
            'updated_at',
            'owner_username',
        ]


class VehicleScanSerializer(serializers.Serializer):
    """Serializer for QR code scanning"""
    unique_id = serializers.UUIDField()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration with photo upload"""

    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        label='Confirm Password'
    )
    photo = serializers.ImageField(
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password',
            'password2',
            'first_name',
            'last_name',
            'photo'
        ]
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': False},
            'last_name': {'required': False},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )

        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError(
                {"email": "A user with this email already exists."}
            )

        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        photo = validated_data.pop('photo', None)

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )

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
        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
            'photo',
            'phone',
            'bio',
        ]
        read_only_fields = [
            'username',
            'email',
            'first_name',
            'last_name',
        ]
