from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VehicleViewSet, OwnerViewSet, UserRegistrationView, get_user_profile
from .dashboard_views import (
    DashboardStatsView,
    ExpiryAlertsView,
    MyVehiclesView,
    DashboardAlertsSummaryView
)
from .admin_auth import admin_login
from .admin_views import (
    admin_get_all_vehicles,
    admin_get_all_users,
    admin_verify_vehicle,
    admin_blacklist_vehicle,
    admin_delete_vehicle,
    admin_dashboard_stats
)

router = DefaultRouter()
router.register(r'vehicles', VehicleViewSet, basename='vehicle')
router.register(r'owners', OwnerViewSet, basename='owner')

urlpatterns = [
    path('', include(router.urls)),
    
    # User registration and profile
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('profile/', get_user_profile, name='user-profile'),
    
    # Dashboard endpoints
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('dashboard/expiries/', ExpiryAlertsView.as_view(), name='dashboard-expiries'),
    path('dashboard/my-vehicles/', MyVehiclesView.as_view(), name='dashboard-my-vehicles'),
    path('dashboard/alerts-summary/', DashboardAlertsSummaryView.as_view(), name='dashboard-alerts-summary'),
    
    # Admin endpoints
    path('admin/login/', admin_login, name='admin-login'),
    path('admin/stats/', admin_dashboard_stats, name='admin-dashboard-stats'),
    path('admin/vehicles/', admin_get_all_vehicles, name='admin-vehicles'),
    path('admin/users/', admin_get_all_users, name='admin-users'),
    path('admin/vehicles/<int:pk>/verify/', admin_verify_vehicle, name='admin-verify-vehicle'),
    path('admin/vehicles/<int:pk>/blacklist/', admin_blacklist_vehicle, name='admin-blacklist-vehicle'),
    path('admin/vehicles/<int:pk>/delete/', admin_delete_vehicle, name='admin-delete-vehicle'),
]
