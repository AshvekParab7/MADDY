# Generated migration for user-based ownership

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('vehicles', '0004_remove_vehicle_insurance_certificate_and_more'),
    ]

    operations = [
        # Add new owner fields
        migrations.AddField(
            model_name='vehicle',
            name='owner_address',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='owner_email',
            field=models.EmailField(blank=True, max_length=254),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='owner_name',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='owner_phone',
            field=models.CharField(blank=True, max_length=15),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='owner_photo',
            field=models.ImageField(blank=True, null=True, upload_to='owner_photos/'),
        ),
        # Add user field (nullable first)
        migrations.AddField(
            model_name='vehicle',
            name='user_owner',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user_vehicles', to=settings.AUTH_USER_MODEL),
        ),
        # Remove old owner field later after data migration
        migrations.RemoveField(
            model_name='vehicle',
            name='owner',
        ),
        # Rename user_owner to owner
        migrations.RenameField(
            model_name='vehicle',
            old_name='user_owner',
            new_name='owner',
        ),
        # Make owner required
        migrations.AlterField(
            model_name='vehicle',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='vehicles', to=settings.AUTH_USER_MODEL),
        ),
    ]
