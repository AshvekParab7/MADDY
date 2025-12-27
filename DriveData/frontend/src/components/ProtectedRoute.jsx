import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('access_token');
  const adminToken = localStorage.getItem('admin_access_token');

  if (!token && !adminToken) {
    // Redirect to login page if not authenticated
    // Save the attempted URL to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated (either as user or admin), render the protected component
  return children;
};

export default ProtectedRoute;
