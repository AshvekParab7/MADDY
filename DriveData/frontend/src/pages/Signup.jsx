import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaUserPlus, FaCamera } from 'react-icons/fa';
import axios from 'axios';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'photo' && files && files[0]) {
      const file = files[0];
      setFormData({
        ...formData,
        photo: file,
      });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear specific field error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (!formData.password2) {
      newErrors.password2 = 'Please confirm your password';
    } else if (formData.password !== formData.password2) {
      newErrors.password2 = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Client-side validation
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('password2', formData.password2);
      if (formData.first_name) formDataToSend.append('first_name', formData.first_name);
      if (formData.last_name) formDataToSend.append('last_name', formData.last_name);
      if (formData.photo) formDataToSend.append('photo', formData.photo);

      const response = await axios.post('http://localhost:8000/api/register/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Registration successful! Please log in.' }
        });
      }, 2000);
    } catch (err) {
      if (err.response?.data) {
        // Server validation errors
        const serverErrors = {};
        Object.keys(err.response.data).forEach(key => {
          if (Array.isArray(err.response.data[key])) {
            serverErrors[key] = err.response.data[key][0];
          } else {
            serverErrors[key] = err.response.data[key];
          }
        });
        setErrors(serverErrors);
      } else if (err.request) {
        setErrors({ general: 'Server is not responding. Please try again later.' });
      } else {
        setErrors({ general: 'An error occurred. Please try again.' });
      }
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="signup-page">
        <div className="signup-container">
          <div className="success-card">
            <div className="success-icon">✓</div>
            <h1>Registration Successful!</h1>
            <p>Redirecting to login page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <div className="signup-icon">
              <FaUserPlus />
            </div>
            <h1>Create Account</h1>
            <p>Join DriveData to manage your vehicles</p>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            {errors.general && (
              <div className="error-message">
                {errors.general}
              </div>
            )}

            {/* Profile Photo */}
            <div className="form-group photo-upload-group">
              <label htmlFor="photo">
                <FaCamera className="input-icon" />
                Profile Photo (Optional)
              </label>
              <div className="photo-upload-container">
                {photoPreview ? (
                  <div className="photo-preview">
                    <img src={photoPreview} alt="Profile preview" />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, photo: null });
                        setPhotoPreview(null);
                      }}
                      className="remove-photo-btn"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="photo-placeholder">
                    <FaCamera size={32} />
                    <p>Upload Photo</p>
                  </div>
                )}
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  onChange={handleChange}
                  accept="image/*"
                  disabled={loading}
                  className="photo-input"
                />
              </div>
              {errors.photo && <span className="error-text">{errors.photo}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first_name">
                  <FaUser className="input-icon" />
                  First Name (Optional)
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="last_name">
                  <FaUser className="input-icon" />
                  Last Name (Optional)
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="username">
                <FaUser className="input-icon" />
                Username *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                className={errors.username ? 'error' : ''}
                disabled={loading}
                required
              />
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <FaEnvelope className="input-icon" />
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? 'error' : ''}
                disabled={loading}
                required
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <FaLock className="input-icon" />
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password (min. 8 characters)"
                className={errors.password ? 'error' : ''}
                disabled={loading}
                required
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password2">
                <FaLock className="input-icon" />
                Confirm Password *
              </label>
              <input
                type="password"
                id="password2"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={errors.password2 ? 'error' : ''}
                disabled={loading}
                required
              />
              {errors.password2 && <span className="error-text">{errors.password2}</span>}
            </div>

            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="login-link">
            Already have an account? <Link to="/login">Log In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
