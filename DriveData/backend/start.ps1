# Backend Setup and Start Script
# Run this in PowerShell from the backend directory

Write-Host "🚀 Starting DriveData Backend Setup..." -ForegroundColor Cyan

# Check if virtual environment exists
if (-Not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Install requirements
Write-Host "Installing requirements..." -ForegroundColor Yellow
pip install -r requirements.txt

# Create media directories
Write-Host "Creating media directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "media\owner_photos" -Force | Out-Null
New-Item -ItemType Directory -Path "media\vehicle_photos" -Force | Out-Null
New-Item -ItemType Directory -Path "media\qr_codes" -Force | Out-Null
New-Item -ItemType Directory -Path "media\vehicle_logos" -Force | Out-Null

# Run migrations
Write-Host "Running migrations..." -ForegroundColor Yellow
python manage.py makemigrations
python manage.py migrate

# Check if superuser needs to be created
Write-Host "`n⚠️  If you haven't created a superuser yet, run:" -ForegroundColor Yellow
Write-Host "python manage.py createsuperuser" -ForegroundColor White

Write-Host "`n✅ Setup complete! Starting server..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Cyan
Write-Host "Server will be available at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Admin panel at: http://localhost:8000/admin`n" -ForegroundColor Cyan

# Start server
python manage.py runserver
