import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaLock, FaUser } from 'react-icons/fa';
import api from '../services/api';
import './AdminLogin.css';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    // Redirect if already logged in as admin
    const adminToken = localStorage.getItem('admin_access_token');
    if (adminToken) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Admin login attempt:', credentials.username);

    try {
      const response = await api.post('/admin/login/', credentials);
      
      console.log('Admin login response:', response.data);
      
      // Store admin tokens separately
      localStorage.setItem('admin_access_token', response.data.access);
      localStorage.setItem('admin_refresh_token', response.data.refresh);
      localStorage.setItem('admin_username', response.data.username);
      localStorage.setItem('admin_role', 'admin');
      
      console.log('Tokens stored, redirecting to dashboard...');
      
      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Admin login error:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.error || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-header">
            <div className="admin-shield">
              <FaShieldAlt />
            </div>
            <h1>Admin Access</h1>
            <p>Authorized Personnel Only</p>
          </div>

          {error && (
            <div className="admin-error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="admin-form-group">
              <label htmlFor="username">
                <FaUser className="input-icon" />
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Enter admin username"
                disabled={loading}
                required
                autoComplete="username"
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="password">
                <FaLock className="input-icon" />
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter admin password"
                disabled={loading}
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="admin-login-button" disabled={loading}>
              {loading ? 'Authenticating...' : 'Admin Login'}
            </button>
          </form>

          <div className="admin-warning">
            <p>⚠️ This area is restricted to authorized administrators only.</p>
            <p>Unauthorized access attempts are logged and monitored.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
