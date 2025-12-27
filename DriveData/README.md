# DriveData - Vehicle Information Management System

## 🚗 Overview
DriveData is a professional vehicle information management system that generates unique QR code embedded logos for each vehicle. By scanning these QR codes, you can instantly access comprehensive vehicle details including photos, owner information, insurance expiry, and other important data.

## ✨ Features
- **Vehicle Management**: Store comprehensive vehicle information
- **QR Code Generation**: Automatic QR code creation for each vehicle
- **Unique Logo**: Custom logo with embedded QR code for each vehicle
- **Owner Management**: Manage owner details with photos
- **Insurance Tracking**: Track insurance and pollution certificate expiry dates
- **Photo Gallery**: Upload and view multiple vehicle photos
- **QR Scanning**: Scan QR codes to instantly retrieve vehicle information
- **Professional UI**: Clean, modern interface with blue and white theme
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🛠️ Technology Stack

### Backend
- Django 5.0.1
- Django REST Framework
- SQLite Database
- Pillow (Image processing)
- QRCode library

### Frontend
- React 18
- Vite
- React Router
- Axios
- HTML5 QR Code Scanner
- React Icons

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn
- Git (optional)

## 🚀 Installation & Setup

### Part 1: Backend Setup (Django)

#### Step 1: Navigate to Backend Directory
```powershell
cd "C:\Users\madha\OneDrive\Documents\MADDY\DriveData\backend"
```

#### Step 2: Create Virtual Environment
```powershell
# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate
```

You should see `(venv)` appear in your terminal prompt.

#### Step 3: Install Python Dependencies
```powershell
pip install -r requirements.txt
```

#### Step 4: Run Database Migrations
```powershell
python manage.py makemigrations
python manage.py migrate
```

#### Step 5: Create Admin User (Optional but Recommended)
```powershell
python manage.py createsuperuser
```
Follow the prompts to create an admin account.

#### Step 6: Create Media Directories
```powershell
# Create media directories for file uploads
New-Item -ItemType Directory -Path "media\owner_photos" -Force
New-Item -ItemType Directory -Path "media\vehicle_photos" -Force
New-Item -ItemType Directory -Path "media\qr_codes" -Force
New-Item -ItemType Directory -Path "media\vehicle_logos" -Force
```

#### Step 7: Start Django Development Server
```powershell
python manage.py runserver
```

The backend should now be running at `http://localhost:8000`

**Keep this terminal open** and open a new terminal for the frontend setup.

---

### Part 2: Frontend Setup (React + Vite)

#### Step 1: Open New Terminal and Navigate to Frontend Directory
```powershell
cd "C:\Users\madha\OneDrive\Documents\MADDY\DriveData\frontend"
```

#### Step 2: Install Node Dependencies
```powershell
npm install
```

This will install all required packages including React, Vite, React Router, etc.

#### Step 3: Start Development Server
```powershell
npm run dev
```

The frontend should now be running at `http://localhost:5173`

---

## 🎯 Using the Application

### Accessing the Application
1. **Frontend**: Open your browser and go to `http://localhost:5173`
2. **Backend Admin**: Go to `http://localhost:8000/admin` (login with superuser credentials)
3. **API**: Available at `http://localhost:8000/api/`

### Adding Your First Vehicle

1. **Add an Owner**:
   - Click "Add Vehicle" in the navbar
   - Click "Add New Owner" button
   - Fill in owner details (name, email, phone, address)
   - Optionally upload owner photo
   - Click "Add Owner"

2. **Add Vehicle**:
   - Select the owner you just created
   - Fill in vehicle details:
     - Registration number
     - Make and model
     - Year, color, fuel type
     - Engine and chassis numbers
     - Important dates (registration, insurance expiry, pollution certificate)
   - Upload vehicle photos (front, back, side)
   - Click "Add Vehicle & Generate Logo"

3. **View Generated Logo & QR Code**:
   - After adding the vehicle, you'll be redirected to the vehicle details page
   - Scroll down to see the generated QR code and logo
   - Download them using the download buttons

### Scanning QR Codes

1. Click "Scan QR" in the navbar
2. Two options:
   - **Scan with Camera**: Click "Scan QR Code" to use your camera
   - **Manual Entry**: Click "Enter Manually" to type the unique ID
3. The system will automatically fetch and display vehicle details

### Managing Vehicles

- **View All Vehicles**: Click "Vehicles" in navbar
- **Search**: Use the search bar to find vehicles by registration, make, model, or owner
- **View Details**: Click "View Details" on any vehicle card
- **Download Logo**: Click "Download Logo" to save the vehicle's unique logo

---

## 📁 Project Structure

```
DriveData/
├── backend/
│   ├── drivedata/          # Main Django project
│   │   ├── settings.py     # Django settings
│   │   ├── urls.py         # URL configuration
│   │   └── ...
│   ├── vehicles/           # Vehicles app
│   │   ├── models.py       # Database models
│   │   ├── views.py        # API views
│   │   ├── serializers.py  # DRF serializers
│   │   ├── urls.py         # App URLs
│   │   └── admin.py        # Admin configuration
│   ├── media/              # Uploaded files
│   ├── manage.py           # Django management script
│   └── requirements.txt    # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── components/     # Reusable components
    │   │   ├── Navbar.jsx
    │   │   └── Footer.jsx
    │   ├── pages/          # Page components
    │   │   ├── Home.jsx
    │   │   ├── VehicleList.jsx
    │   │   ├── AddVehicle.jsx
    │   │   ├── VehicleDetails.jsx
    │   │   ├── ScanQR.jsx
    │   │   └── About.jsx
    │   ├── services/       # API services
    │   │   └── api.js
    │   ├── App.jsx         # Main app component
    │   └── main.jsx        # Entry point
    ├── package.json        # Node dependencies
    └── vite.config.js      # Vite configuration
```

---

## 🔧 Configuration

### Backend Configuration

#### Database
By default, the project uses SQLite. The database file `db.sqlite3` will be created automatically.

#### CORS Settings
CORS is configured to allow requests from `http://localhost:5173`. Modify in `drivedata/settings.py` if needed.

#### Media Files
Uploaded files are stored in the `media/` directory. The backend serves these files in development mode.

### Frontend Configuration

#### API Base URL
The API base URL is set in `src/services/api.js`. Currently set to `http://localhost:8000/api`.

#### Vite Proxy
Vite is configured to proxy `/api` and `/media` requests to the Django backend.

---

## 🎨 Customization

### Changing Colors
The color scheme can be modified in `frontend/src/index.css`:
```css
:root {
  --primary-blue: #1e40af;
  --secondary-blue: #3b82f6;
  --light-blue: #60a5fa;
  /* ... etc */
}
```

### Adding Fields
1. Update Django model in `backend/vehicles/models.py`
2. Create and run migrations
3. Update serializer in `backend/vehicles/serializers.py`
4. Update frontend forms and display components

---

## 📝 API Endpoints

### Vehicles
- `GET /api/vehicles/` - List all vehicles
- `POST /api/vehicles/` - Create new vehicle
- `GET /api/vehicles/{id}/` - Get vehicle details
- `PUT /api/vehicles/{id}/` - Update vehicle
- `DELETE /api/vehicles/{id}/` - Delete vehicle
- `POST /api/vehicles/scan/` - Scan QR code
- `GET /api/vehicles/{id}/download-logo/` - Download logo

### Owners
- `GET /api/owners/` - List all owners
- `POST /api/owners/` - Create new owner
- `GET /api/owners/{id}/` - Get owner details
- `PUT /api/owners/{id}/` - Update owner
- `DELETE /api/owners/{id}/` - Delete owner

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Cannot connect to database
```powershell
# Solution: Run migrations
python manage.py migrate
```

**Problem**: Module not found error
```powershell
# Solution: Reinstall dependencies
pip install -r requirements.txt
```

**Problem**: Port 8000 already in use
```powershell
# Solution: Kill process or use different port
python manage.py runserver 8001
```

### Frontend Issues

**Problem**: Cannot connect to backend
- Ensure Django server is running on port 8000
- Check CORS settings in Django

**Problem**: npm install fails
```powershell
# Solution: Clear cache and retry
npm cache clean --force
npm install
```

**Problem**: QR Scanner not working
- Ensure you're using HTTPS or localhost
- Grant camera permissions when prompted
- Try using manual entry option

---

## 🚀 Building for Production

### Backend
```powershell
# Set DEBUG=False in settings.py
# Configure static files
python manage.py collectstatic

# Use a production server like Gunicorn
pip install gunicorn
gunicorn drivedata.wsgi:application
```

### Frontend
```powershell
npm run build
```
This creates a `dist/` folder with optimized production files.

---

## 📚 Learning Resources

### For Beginners

**Django Resources**:
- [Official Django Tutorial](https://docs.djangoproject.com/en/5.0/intro/tutorial01/)
- [Django REST Framework Guide](https://www.django-rest-framework.org/tutorial/quickstart/)

**React Resources**:
- [Official React Tutorial](https://react.dev/learn)
- [Vite Documentation](https://vitejs.dev/guide/)

**Python**:
- [Python Official Tutorial](https://docs.python.org/3/tutorial/)

**JavaScript/React**:
- [JavaScript Info](https://javascript.info/)
- [React Router Documentation](https://reactrouter.com/)

---

## 🤝 Contributing

Feel free to fork this project and make improvements!

---

## 📄 License

This project is open source and available for educational purposes.

---

## 💡 Tips for Beginners

1. **Always activate the virtual environment** before working on the backend
2. **Keep both servers running** during development (Django and Vite)
3. **Check the browser console** for frontend errors
4. **Check the terminal** for backend errors
5. **Use the Django admin panel** to view database records
6. **Test the API** using the admin or tools like Postman before building frontend features
7. **Read error messages carefully** - they usually tell you exactly what's wrong

---

## 🆘 Getting Help

If you encounter issues:
1. Check the error message in terminal/console
2. Review the troubleshooting section above
3. Verify all dependencies are installed
4. Ensure both servers are running
5. Check that file paths are correct for your system

---

## 🎉 Next Steps

After getting the application running:
1. Add multiple vehicles and owners
2. Generate logos and QR codes
3. Test the QR scanning functionality
4. Customize the colors and styling
5. Add new features based on your needs
6. Deploy to a production server

---

## Contact & Support

For questions or support, please create an issue in the project repository.

Happy coding! 🚗💙
