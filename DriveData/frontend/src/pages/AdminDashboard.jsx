import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaShieldAlt, FaCar, FaUsers, FaSignOutAlt, FaChartLine, FaClock } from 'react-icons/fa';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_vehicles: 0,
    total_users: 0,
    recent_vehicles: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem('admin_access_token');
    if (!adminToken) {
      navigate('/admin/login', { replace: true });
      return;
    }
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const response = await axios.get('http://localhost:8000/api/admin/stats/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_username');
    localStorage.removeItem('admin_role');
    navigate('/admin/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-navbar">
        <div className="admin-nav-content">
          <div className="admin-brand">
            <FaShieldAlt />
            <span>Admin Panel</span>
          </div>
          <div className="admin-nav-links">
            <Link to="/admin/dashboard" className="active">Dashboard</Link>
            <Link to="/admin/vehicles">Vehicles</Link>
            <button onClick={handleLogout} className="admin-logout-btn">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-header-section">
          <h1>Admin Dashboard</h1>
          <p>System Overview and Statistics</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card vehicles">
            <div className="stat-icon">
              <FaCar />
            </div>
            <div className="stat-info">
              <h3>Total Vehicles</h3>
              <p className="stat-number">{stats.total_vehicles}</p>
            </div>
          </div>

          <div className="stat-card users">
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-info">
              <h3>Total Users</h3>
              <p className="stat-number">{stats.total_users}</p>
            </div>
          </div>

          <div className="stat-card growth">
            <div className="stat-icon">
              <FaChartLine />
            </div>
            <div className="stat-info">
              <h3>Registry Growth</h3>
              <p className="stat-number">+{stats.recent_vehicles.length}</p>
              <span className="stat-label">Recent additions</span>
            </div>
          </div>
        </div>

        <div className="recent-vehicles-section">
          <div className="section-header">
            <h2><FaClock /> Recently Added Vehicles</h2>
            <Link to="/admin/vehicles" className="view-all-link">View All →</Link>
          </div>

          {stats.recent_vehicles.length === 0 ? (
            <div className="no-data">
              <p>No vehicles registered yet</p>
            </div>
          ) : (
            <div className="vehicles-table">
              <table>
                <thead>
                  <tr>
                    <th>Registration No.</th>
                    <th>Make & Model</th>
                    <th>Year</th>
                    <th>Owner</th>
                    <th>Added On</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_vehicles.map((vehicle) => (
                    <tr key={vehicle.id}>
                      <td className="reg-number">{vehicle.registration_number}</td>
                      <td>{vehicle.make} {vehicle.model}</td>
                      <td>{vehicle.year}</td>
                      <td>{vehicle.owner_name || 'N/A'}</td>
                      <td>{formatDate(vehicle.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
