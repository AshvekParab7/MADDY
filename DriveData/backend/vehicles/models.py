from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from cloudinary.models import CloudinaryField
import uuid
import qrcode
from io import BytesIO
from django.core.files import File
from PIL import Image, ImageDraw, ImageFont
import os


class UserProfile(models.Model):
    """Extended user profile to store additional information like photo"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    photo = CloudinaryField(null=True, blank=True)
    phone = models.CharField(max_length=15, blank=True)
    bio = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

    class Meta:
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Create UserProfile when User is created"""
    if created:
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """Save UserProfile when User is saved"""
    if hasattr(instance, 'profile'):
        instance.profile.save()


class Owner(models.Model):
    """Model to store vehicle owner information"""
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    address = models.TextField()
    photo = CloudinaryField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']


class Vehicle(models.Model):
    """Model to store vehicle information with QR code generation"""
    
    FUEL_CHOICES = [
        ('petrol', 'Petrol'),
        ('diesel', 'Diesel'),
        ('electric', 'Electric'),
        ('hybrid', 'Hybrid'),
        ('cng', 'CNG'),
    ]
    
    # Unique identifier
    unique_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    
    # Vehicle Information
    registration_number = models.CharField(max_length=50, unique=True)
    make = models.CharField(max_length=100)  # e.g., Toyota, Honda
    model = models.CharField(max_length=100)  # e.g., Camry, Civic
    year = models.IntegerField()
    color = models.CharField(max_length=50)
    fuel_type = models.CharField(max_length=20, choices=FUEL_CHOICES)
    engine_number = models.CharField(max_length=100)
    chassis_number = models.CharField(max_length=100)
    
    # Owner (authenticated user)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vehicles')
    
    # Additional owner information (optional)
    owner_name = models.CharField(max_length=200, blank=True)
    owner_email = models.EmailField(blank=True)
    owner_phone = models.CharField(max_length=15, blank=True)
    owner_address = models.TextField(blank=True)
    owner_photo = CloudinaryField(null=True, blank=True)
    
    # Documents & Dates
    insurance_expiry = models.DateField()
    pollution_certificate_expiry = models.DateField()
    registration_date = models.DateField()
    
    # Photos
    front_photo = CloudinaryField(null=True, blank=True)
    back_photo = CloudinaryField(null=True, blank=True)
    side_photo = CloudinaryField(null=True, blank=True)
    
    # QR Code & Logo
    qr_code = CloudinaryField(blank=True)
    logo = CloudinaryField(blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.registration_number} - {self.make} {self.model}"

    def save(self, *args, **kwargs):
        # Save first to get primary key
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        # Generate QR code after object has pk (only for new objects)
        if is_new and not self.qr_code:
            self.generate_qr_code()
            # Save again with QR code, but prevent recursion
            super().save(update_fields=['qr_code'])

    def generate_qr_code(self):
        """Generate QR code containing vehicle unique ID"""
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        
        # QR code contains the unique ID
        qr_data = str(self.unique_id)
        qr.add_data(qr_data)
        qr.make(fit=True)

        # Create QR code image with blue color to match theme
        qr_image = qr.make_image(fill_color="#1e40af", back_color="white")
        
        # Save to BytesIO
        buffer = BytesIO()
        qr_image.save(buffer, format='PNG')
        buffer.seek(0)
        
        # Save to model
        filename = f'qr_{self.registration_number}.png'
        self.qr_code.save(filename, File(buffer), save=False)
        
        print(f"QR code generated for {self.registration_number}")

    def generate_logo(self):
        """Generate a unique logo with car silhouette and embedded QR code"""
        # Create logo image (1200x600) - wider for better car shape
        logo_width, logo_height = 1200, 600
        
        # Create base image with white background
        logo_img = Image.new('RGB', (logo_width, logo_height), (255, 255, 255))
        draw = ImageDraw.Draw(logo_img)
        
        # Define car silhouette coordinates (SUV shape)
        car_color = (30, 30, 30)  # Very dark gray/black
        blue_accent = (30, 64, 175)  # Blue color matching theme (#1e40af)
        
        # Main car body - simplified SUV silhouette
        car_body = [
            # Front hood
            (200, 200), (350, 150), (450, 130), 
            # Windshield and roof
            (550, 130), (700, 130), (800, 150), (950, 200),
            # Roof line
            (950, 200), (950, 280), (920, 310),
            # Back door/window
            (920, 310), (920, 380), (880, 410),
            # Bottom back
            (880, 480), (820, 500), (780, 500), (750, 480),
            # Between wheels
            (750, 480), (450, 480), (420, 500), (380, 500), (340, 480),
            # Bottom front
            (340, 480), (280, 410), (280, 380), (240, 310),
            # Front
            (200, 280), (200, 200)
        ]
        draw.polygon(car_body, fill=car_color)
        
        # Windows (white areas)
        # Front windshield
        front_window = [(360, 170), (520, 150), (500, 240), (340, 260)]
        draw.polygon(front_window, fill=(255, 255, 255))
        
        # Rear window  
        rear_window = [(730, 150), (890, 170), (870, 260), (710, 240)]
        draw.polygon(rear_window, fill=(255, 255, 255))
        
        # Blue accent on the side (door area)
        side_accent = [(950, 220), (1050, 280), (1050, 360), (950, 360)]
        draw.polygon(side_accent, fill=blue_accent)
        
        # Front wheel
        wheel_y = 440
        draw.ellipse([280, wheel_y, 400, wheel_y + 120], fill=car_color)
        draw.ellipse([310, wheel_y + 30, 370, wheel_y + 90], fill=(255, 255, 255))
        draw.ellipse([325, wheel_y + 45, 355, wheel_y + 75], fill=car_color)
        
        # Rear wheel
        draw.ellipse([780, wheel_y, 900, wheel_y + 120], fill=car_color)
        draw.ellipse([810, wheel_y + 30, 870, wheel_y + 90], fill=(255, 255, 255))
        draw.ellipse([825, wheel_y + 45, 855, wheel_y + 75], fill=car_color)
        
        # Load and embed QR code in the center of the car
        if self.qr_code:
            try:
                # Open QR code directly from CloudinaryField (file-like object)
                qr_img = Image.open(self.qr_code)
                # Resize QR code to fit prominently in car body
                qr_size = 300
                qr_img = qr_img.resize((qr_size, qr_size), Image.Resampling.LANCZOS)
                
                # Position QR code in the center/door area of the car
                qr_x = (logo_width - qr_size) // 2
                qr_y = (logo_height - qr_size) // 2 + 30
                
                # Paste QR code directly (it already has white background)
                logo_img.paste(qr_img, (qr_x, qr_y))
                print(f"QR code embedded in logo for {self.registration_number}")
            except Exception as e:
                print(f"Error embedding QR code: {e}")
        
        # Save logo
        buffer = BytesIO()
        logo_img.save(buffer, format='PNG')
        buffer.seek(0)
        
        filename = f'logo_{self.registration_number}.png'
        self.logo.save(filename, File(buffer), save=False)
        print(f"Logo generated for {self.registration_number}")

    class Meta:
        ordering = ['-created_at']
