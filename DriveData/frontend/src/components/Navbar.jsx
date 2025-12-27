import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaCar, FaBars, FaTimes, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [username, setUsername] = useState('');
  const [userPhoto, setUserPhoto] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
    
    // Get username from token and fetch user profile
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUsername(payload.username || 'User');
        
        // Fetch user profile to get photo
        fetchUserProfile();
      } catch (error) {
        setUsername('User');
      }
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await api.post(
  '/owners/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.photo) {
        setUserPhoto(response.data.photo);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleLogout = () => {
    // Clear tokens from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // Update authentication state
    setIsAuthenticated(false);
    setUsername('');
    
    // Close dropdowns
    setIsOpen(false);
    setShowProfileDropdown(false);
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            <FaCar className="brand-icon" />
            <span className="brand-text">DriveData</span>
          </Link>
        </div>

        <button className="navbar-toggle" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className="navbar-right">
          <ul className={`navbar-menu ${isOpen ? 'active' : ''}`}>
            <li><NavLink to="/" onClick={() => setIsOpen(false)} end>Home</NavLink></li>
            <li><NavLink to="/scan" onClick={() => setIsOpen(false)}>Scan QR</NavLink></li>
            
            {isAuthenticated ? (
              <>
                <li><NavLink to="/vehicles" onClick={() => setIsOpen(false)}>Vehicles</NavLink></li>
                <li><NavLink to="/add-vehicle" onClick={() => setIsOpen(false)}>Add Vehicle</NavLink></li>
                <li><NavLink to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</NavLink></li>
                <li className="mobile-only">
                  <button className="mobile-logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/login" onClick={() => setIsOpen(false)} className="login-link">
                    <FaSignInAlt /> Login
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/signup" onClick={() => setIsOpen(false)} className="signup-link">
                    <FaUserPlus /> Sign Up
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {/* Profile Dropdown */}
          {isAuthenticated && (
            <div className="profile-dropdown-container" ref={dropdownRef}>
              <button className="profile-button" onClick={toggleProfileDropdown}>
                {userPhoto ? (
                  <img src={userPhoto} alt={username} className="profile-photo" />
                ) : (
                  <FaUserCircle className="profile-icon" />
                )}
                <span className="profile-username">{username}</span>
                <FaChevronDown className={`dropdown-arrow ${showProfileDropdown ? 'open' : ''}`} />
              </button>

              {showProfileDropdown && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    {userPhoto ? (
                      <img src={userPhoto} alt={username} className="dropdown-avatar-img" />
                    ) : (
                      <FaUserCircle className="dropdown-avatar" />
                    )}
                    <div className="dropdown-user-info">
                      <span className="dropdown-username">{username}</span>
                      <span className="dropdown-label">Account</span>
                    </div>
                  </div>
                  <div className="profile-dropdown-divider"></div>
                  <button className="profile-dropdown-item logout-item" onClick={handleLogout}>
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
