import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username: formData.username,
        password: formData.password,
      });

      // Store tokens in localStorage
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      // Redirect to the page user was trying to access, or dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      
      // Force reload to update navbar state
      window.location.href = from;
    } catch (err) {
      if (err.response) {
        // Server responded with error
        if (err.response.status === 401) {
          setError('Invalid username or password');
        } else {
          setError('Login failed. Please try again.');
        }
      } else if (err.request) {
        // Request was made but no response
        setError('Server is not responding. Please try again later.');
      } else {
        // Something else happened
        setError('An error occurred. Please try again.');
      }
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">
              <FaSignInAlt />
            </div>
            <h1>Welcome Back</h1>
            <p>Sign in to access your DriveData account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username">
                <FaUser className="input-icon" />
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                disabled={loading}
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <FaLock className="input-icon" />
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className={`btn-login ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/Signup" className="register-link">
                Register here
              </Link>
            </p>
            <p className="admin-link-text">
              <Link to="/admin/login" className="admin-access-link">
                Admin Access
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
