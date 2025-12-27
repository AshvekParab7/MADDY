# Render Deployment Guide

## Production-Ready Changes Made

### 1. Environment Variables
- **DEBUG**: Controlled via environment variable (defaults to True for local dev)
- **SECRET_KEY**: Uses environment variable in production
- **ALLOWED_HOSTS**: Automatically includes Render hostname when DEBUG=False

### 2. Static Files
- **WhiteNoise**: Added for efficient static file serving
- **STATIC_ROOT**: Configured as `staticfiles/`
- **Compressed Storage**: Enabled for optimal performance

### 3. Dependencies
Updated `requirements.txt` with:
- `whitenoise==6.6.0` - Static file serving
- `gunicorn==21.2.0` - Production WSGI server

### 4. Build Script
Created `build.sh` for automated deployment

---

## Deployment Steps on Render

### Step 1: Create Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **Web Service**
3. Connect your GitHub/GitLab repository

### Step 2: Configure Service
```
Name: drivedata-backend
Environment: Python 3
Region: Choose closest to your users
Branch: main (or your default branch)
Root Directory: backend
```

### Step 3: Build & Start Commands
```bash
Build Command: ./build.sh
Start Command: gunicorn drivedata.wsgi:application
```

### Step 4: Environment Variables
Add these in Render's Environment section:

```bash
PYTHON_VERSION=3.11.0
DEBUG=False
SECRET_KEY=<generate-a-strong-random-secret-key>
RENDER_EXTERNAL_HOSTNAME=<your-app>.onrender.com
```

**Generate SECRET_KEY** with:
```python
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

### Step 5: Deploy
1. Click **Create Web Service**
2. Render will automatically build and deploy your app
3. Your app will be available at: `https://<your-app>.onrender.com`

---

## Post-Deployment Tasks

### 1. Create Superuser
Run in Render Shell:
```bash
python manage.py createsuperuser
```

### 2. Update Frontend API URL
Update your frontend's API base URL to:
```javascript
const API_BASE_URL = 'https://<your-app>.onrender.com/api'
```

### 3. Update CORS Settings
After deploying frontend, add its URL to `CORS_ALLOWED_ORIGINS` in settings.py:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://<your-frontend-app>.onrender.com",  # Add this
]
```

---

## Important Notes

### Database
- Currently using SQLite (included in deployment)
- For production, consider PostgreSQL (Render offers free tier)
- To migrate to PostgreSQL, add `dj-database-url` and update DATABASES setting

### Media Files
- Media uploads are NOT persistent on Render's free tier
- Consider using AWS S3, Cloudinary, or similar for production
- Current setup stores files in local `media/` folder

### Free Tier Limitations
- App spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- Upgrade to paid tier for always-on service

---

## Troubleshooting

### Static Files Not Loading
Run in Render Shell:
```bash
python manage.py collectstatic --no-input
```

### Database Issues
Run migrations:
```bash
python manage.py migrate
```

### View Logs
Check Render's **Logs** tab for real-time application logs

---

## Local Development

Your local development setup remains unchanged:
- DEBUG=True by default
- SQLite database
- Development server: `python manage.py runserver`

All production settings only activate when `DEBUG=False`.
