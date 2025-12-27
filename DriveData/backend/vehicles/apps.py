from django.apps import AppConfig
from django.contrib.auth import get_user_model
from django.db.models.signals import post_migrate

class VehiclesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'vehicles'

    def ready(self):
        post_migrate.connect(create_admin_user, sender=self)

def create_admin_user(sender, **kwargs):
    User = get_user_model()

    if not User.objects.filter(username="admin").exists():
        User.objects.create_superuser(
            username="admin",
            email="admin@drivedata.com",
            password="Admin@123"
        )
