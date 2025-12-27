import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    // Check for admin token first, then user token
    const adminToken = localStorage.getItem('admin_access_token');
    const userToken = localStorage.getItem('access_token');
    const token = adminToken || userToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } else {
          // No refresh token, redirect to login
          localStorage.removeItem('access_token');
          window.location.href = '/login';
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Create axios instance for multipart/form-data with auth
const createAuthFormDataInstance = () => {
  const token = localStorage.getItem('access_token');
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

// Vehicle API calls
export const vehicleAPI = {
  // Get all vehicles
  getAllVehicles: () => api.get('/vehicles/'),
  
  // Get single vehicle
  getVehicle: (id) => api.get(`/vehicles/${id}/`),
  
  // Create vehicle
  createVehicle: (formData) => {
    const authApi = createAuthFormDataInstance();
    return authApi.post('/vehicles/', formData);
  },
  
  // Update vehicle
  updateVehicle: (id, formData) => {
    const authApi = createAuthFormDataInstance();
    return authApi.put(`/vehicles/${id}/`, formData);
  },
  
  // Delete vehicle
  deleteVehicle: (id) => api.delete(`/vehicles/${id}/`),
  
  // Scan QR code
  scanQR: (uniqueId) => api.post('/vehicles/scan/', { unique_id: uniqueId }),
  
  // Download logo
  downloadLogo: (id) => api.get(`/vehicles/${id}/download-logo/`),
};

// Owner API calls
export const ownerAPI = {
  // Get all owners
  getAllOwners: () => api.get('/owners/'),
  
  // Get single owner
  getOwner: (id) => api.get(`/owners/${id}/`),
  
  // Create owner
  createOwner: (formData) => {
    const authApi = createAuthFormDataInstance();
    return authApi.post('/owners/', formData);
  },
  
  // Update owner
  updateOwner: (id, formData) => {
    const authApi = createAuthFormDataInstance();
    return authApi.put(`/owners/${id}/`, formData);
  },
  
  // Delete owner
  deleteOwner: (id) => api.delete(`/owners/${id}/`),
};

// Dashboard API calls
export const dashboardAPI = {
  // Get dashboard statistics
  getStats: () => api.get('/dashboard/stats/'),
  
  // Get expiry alerts
  getExpiries: () => api.get('/dashboard/expiries/'),
  
  // Get my vehicles
  getMyVehicles: () => api.get('/dashboard/my-vehicles/'),
  
  // Get alerts summary
  getAlertsSummary: () => api.get('/dashboard/alerts-summary/'),
};

export default api;
