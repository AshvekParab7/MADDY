# Troubleshooting Guide - Owner Creation Issue

## Quick Fixes

### Fix 1: Check Django Server is Running
1. Open the terminal where you ran `python manage.py runserver`
2. Make sure you see: `Starting development server at http://127.0.0.1:8000/`
3. If not running, restart it:
```powershell
cd "C:\Users\madha\OneDrive\Documents\MADDY\DriveData\backend"
.\venv\Scripts\Activate
python manage.py runserver
```

### Fix 2: Check Browser Console
1. Open your browser (where the app is running)
2. Press `F12` to open Developer Tools
3. Go to "Console" tab
4. Try adding an owner again
5. Look for red error messages
6. Share the error details

### Fix 3: Check Network Tab
1. In Developer Tools, go to "Network" tab
2. Try adding an owner
3. Look for the request to `http://localhost:8000/api/owners/`
4. Click on it
5. Check the "Response" tab to see the actual error

### Fix 4: Test Backend Directly

#### Using Django Admin (Easiest):
1. Go to: http://localhost:8000/admin
2. Login with superuser credentials
3. Click "Owners"
4. Click "Add Owner"
5. Fill in the form and save
6. If this works, the backend is fine and it's a frontend issue

#### Using Browser (API Test):
1. Go to: http://localhost:8000/api/owners/
2. You should see a list of owners (might be empty)
3. If you see an error page, the backend has an issue

### Fix 5: Common Issues & Solutions

#### Issue: CORS Error
**Error in console**: "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution**:
1. Go to `backend/drivedata/settings.py`
2. Find `CORS_ALLOWED_ORIGINS`
3. Make sure it includes:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```
4. Restart Django server

#### Issue: 404 Not Found
**Error**: Cannot find `/api/owners/`

**Solution**: Check that `vehicles` app is in INSTALLED_APPS in settings.py

#### Issue: 500 Internal Server Error
**Error**: Server error when creating owner

**Solution**: 
1. Check Django terminal for error details
2. Make sure migrations are run:
```powershell
python manage.py makemigrations
python manage.py migrate
```

#### Issue: Photo Upload Fails
**Error**: Related to image upload

**Solution**:
1. Make sure Pillow is installed:
```powershell
pip install Pillow
```
2. Check media directories exist:
```powershell
New-Item -ItemType Directory -Path "media\owner_photos" -Force
```

## Step-by-Step Debugging

### Step 1: Verify Backend
```powershell
cd "C:\Users\madha\OneDrive\Documents\MADDY\DriveData\backend"
.\venv\Scripts\Activate
python manage.py shell
```

Then in Python shell:
```python
from vehicles.models import Owner
from vehicles.serializers import OwnerSerializer

# Try creating an owner programmatically
owner_data = {
    'name': 'Test Owner',
    'email': 'test@example.com',
    'phone': '1234567890',
    'address': '123 Test St'
}

serializer = OwnerSerializer(data=owner_data)
if serializer.is_valid():
    owner = serializer.save()
    print("✅ Owner created successfully:", owner.name)
else:
    print("❌ Validation errors:", serializer.errors)
```

### Step 2: Check Django Logs
Look at your Django terminal for any error messages when you try to create an owner.

### Step 3: Test Frontend API Call
Open browser console and run:
```javascript
fetch('http://localhost:8000/api/owners/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Test Owner',
    email: 'test@example.com',
    phone: '1234567890',
    address: '123 Test Street'
  })
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

## Updated Code Files

The following files have been updated with better error handling:

### frontend/src/pages/AddVehicle.jsx
- ✅ Fixed FormData creation for owner
- ✅ Added proper file upload handling
- ✅ Added detailed error messages
- ✅ Added console logging for debugging

### Changes Made:
1. Explicitly append each field instead of looping
2. Check if photo is a File object before appending
3. Show actual error message from backend
4. Log error details to console

## What to Check Now

1. ✅ Make sure Django server is running
2. ✅ Try adding owner again and check console for errors
3. ✅ Look at Network tab in browser DevTools
4. ✅ Check Django terminal for error messages
5. ✅ Try creating owner via Django admin panel

## Report Back

Please share:
1. Error message from browser console (F12 -> Console tab)
2. Error from Network tab (F12 -> Network tab -> Click the failed request)
3. Any error from Django terminal
4. Can you create owner via Django admin panel?

This will help identify the exact issue!
