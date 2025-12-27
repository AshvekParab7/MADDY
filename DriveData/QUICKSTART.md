# Quick Start Guide - DriveData

## For Complete Beginners

This guide will walk you through setting up and running the DriveData application step by step.

## Step 1: Open PowerShell

1. Press `Windows Key + X`
2. Click "Windows PowerShell" or "Terminal"

## Step 2: Setup Backend (Django)

### 2.1 Navigate to Backend Folder
```powershell
cd "C:\Users\madha\OneDrive\Documents\MADDY\DriveData\backend"
```

### 2.2 Create Virtual Environment
```powershell
python -m venv venv
```
This creates a folder called `venv` with Python packages.

### 2.3 Activate Virtual Environment
```powershell
.\venv\Scripts\Activate
```
You should see `(venv)` at the start of your command line.

### 2.4 Install Required Packages
```powershell
pip install -r requirements.txt
```
Wait for all packages to install (this may take a few minutes).

### 2.5 Setup Database
```powershell
python manage.py makemigrations
python manage.py migrate
```
This creates the database file.

### 2.6 Create Admin Account
```powershell
python manage.py createsuperuser
```
Enter:
- Username (e.g., admin)
- Email (can be fake like admin@test.com)
- Password (enter twice, doesn't show on screen)

### 2.7 Create Upload Folders
```powershell
New-Item -ItemType Directory -Path "media\owner_photos" -Force
New-Item -ItemType Directory -Path "media\vehicle_photos" -Force
New-Item -ItemType Directory -Path "media\qr_codes" -Force
New-Item -ItemType Directory -Path "media\vehicle_logos" -Force
```

### 2.8 Start Backend Server
```powershell
python manage.py runserver
```

**IMPORTANT**: Keep this window open! The server must keep running.

You should see:
```
Starting development server at http://127.0.0.1:8000/
```

## Step 3: Setup Frontend (React)

### 3.1 Open NEW PowerShell Window
Keep the first one running! Open a second terminal window.

### 3.2 Navigate to Frontend Folder
```powershell
cd "C:\Users\madha\OneDrive\Documents\MADDY\DriveData\frontend"
```

### 3.3 Install Node Packages
```powershell
npm install
```
This will take a few minutes. Wait for it to complete.

### 3.4 Start Frontend Server
```powershell
npm run dev
```

You should see:
```
Local: http://localhost:5173/
```

## Step 4: Open the Application

1. Open your web browser
2. Go to: `http://localhost:5173`
3. You should see the DriveData homepage!

## Step 5: Add Your First Vehicle

1. Click "Add Vehicle" in the top navigation
2. Click "Add New Owner"
3. Fill in owner details:
   - Name: John Doe
   - Email: john@example.com
   - Phone: 1234567890
   - Address: 123 Main St
4. Click "Add Owner"
5. Select the owner from dropdown
6. Fill in vehicle details:
   - Registration: DL01AB1234
   - Make: Toyota
   - Model: Camry
   - Year: 2023
   - Color: Blue
   - Fuel Type: Petrol
   - Engine Number: ENG123456
   - Chassis Number: CHS123456
   - Registration Date: Select a date
   - Insurance Expiry: Select a future date
   - Pollution Certificate Expiry: Select a future date
7. Click "Add Vehicle & Generate Logo"

## Step 6: View Your Vehicle

After adding, you'll see:
- Vehicle details
- Owner information
- QR Code
- Custom Logo with embedded QR

Click "Download Logo" to save it!

## Step 7: Test QR Scanning

1. Click "Scan QR" in navigation
2. Two options:
   - Use "Scan QR Code" if you have a webcam
   - Use "Enter Manually" and copy the unique ID from vehicle details

## Common Issues & Solutions

### Issue 1: "python is not recognized"
**Solution**: Install Python from python.org

### Issue 2: "npm is not recognized"
**Solution**: Install Node.js from nodejs.org

### Issue 3: Port already in use
**Solution**: Close the existing server and restart

### Issue 4: Cannot connect to backend
**Solution**: Make sure Django server (Step 2.8) is still running

### Issue 5: Virtual environment activation fails
**Solution**: Run PowerShell as Administrator

## Stopping the Application

To stop the servers:
1. Go to each PowerShell window
2. Press `Ctrl + C`
3. Type `deactivate` in the backend terminal (to exit virtual environment)

## Running Again Later

### Start Backend:
```powershell
cd "C:\Users\madha\OneDrive\Documents\MADDY\DriveData\backend"
.\venv\Scripts\Activate
python manage.py runserver
```

### Start Frontend (in new terminal):
```powershell
cd "C:\Users\madha\OneDrive\Documents\MADDY\DriveData\frontend"
npm run dev
```

## Access Django Admin Panel

1. Go to: `http://localhost:8000/admin`
2. Login with superuser credentials you created
3. You can view/edit all data here

## Tips

✅ **Always keep both servers running** (Django and Vite)
✅ **Check terminal for error messages** if something doesn't work
✅ **Make sure you're in the right folder** before running commands
✅ **Virtual environment must be active** (see `(venv)` in terminal)
✅ **Use the admin panel** to view database records

## What Each Command Does

- `cd`: Change directory (move to folder)
- `python -m venv venv`: Create virtual environment
- `pip install`: Install Python packages
- `npm install`: Install Node packages
- `python manage.py migrate`: Setup database
- `python manage.py runserver`: Start Django server
- `npm run dev`: Start development server

## Need Help?

Check the main README.md file for detailed information and troubleshooting.

Happy coding! 🎉
