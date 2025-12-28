"""
Management command to generate QR codes for vehicles that don't have them
Usage: python manage.py generate_qr_codes
"""
from django.core.management.base import BaseCommand
from vehicles.models import Vehicle


class Command(BaseCommand):
    help = 'Generate QR codes and logos for vehicles that are missing them'

    def handle(self, *args, **options):
        # Find vehicles without QR codes
        vehicles_without_qr = Vehicle.objects.filter(qr_code='')
        count = vehicles_without_qr.count()
        
        self.stdout.write(f"Found {count} vehicles without QR codes")
        
        for vehicle in vehicles_without_qr:
            try:
                self.stdout.write(f"Generating QR code for {vehicle.registration_number}...")
                
                # Generate QR code
                vehicle.generate_qr_code()
                
                # Generate logo
                vehicle.generate_logo()
                
                # Save the vehicle
                vehicle.save(update_fields=['qr_code', 'logo'])
                
                self.stdout.write(self.style.SUCCESS(f"✓ Generated QR and logo for {vehicle.registration_number}"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"✗ Failed for {vehicle.registration_number}: {str(e)}"))
        
        self.stdout.write(self.style.SUCCESS(f"\nCompleted! Processed {count} vehicles"))
