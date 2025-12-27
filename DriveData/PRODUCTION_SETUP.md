# Production Deployment - Quick Reference

## ✅ Changes Made

1. **DEBUG Control**: Environment variable `DEBUG` (defaults to True locally)
2. **SECRET_KEY**: Environment variable `SECRET_KEY` for production
3. **ALLOWED_HOSTS**: Auto-configures from `RENDER_EXTERNAL_HOSTNAME`
4. **WhiteNoise**: Added for static file serving
5. **STATIC_ROOT**: Configured as `backend/staticfiles/`
6. **Dependencies**: Added `whitenoise` and `gunicorn`
7. **Build Script**: Created `backend/build.sh`

## 🚀 Deploy to Render

### Quick Setup
```
Build Command: ./build.sh
Start Command: gunicorn drivedata.wsgi:application
Root Directory: backend
```

### Required Environment Variables
```bash
DEBUG=False
SECRET_KEY=<your-random-secret-key>
RENDER_EXTERNAL_HOSTNAME=<your-app>.onrender.com
PYTHON_VERSION=3.11.0
```

### Generate SECRET_KEY
```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

## 📝 Post-Deployment
1. Create superuser via Render Shell
2. Update frontend API URL
3. Add frontend URL to CORS_ALLOWED_ORIGINS

## 🔧 Local Development
No changes needed! Run normally:
```bash
python manage.py runserver
```

All production settings only activate when DEBUG=False.

---

See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) for detailed instructions.
