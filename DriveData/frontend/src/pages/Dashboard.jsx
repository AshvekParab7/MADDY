/**
 * Dashboard Page - Control & Alert Center for DriveData
 * 
 * This is the main dashboard displaying:
 * - Overview statistics cards
 * - Expiry alerts table
 * - Quick access to user's vehicles
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import StatsCards from '../components/dashboard/StatsCards';
import ExpiryTable from '../components/dashboard/ExpiryTable';
import MyVehiclesMini from '../components/dashboard/MyVehiclesMini';
import { dashboardAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // State management
  const [stats, setStats] = useState(null);
  const [expiries, setExpiries] = useState([]);
  const [myVehicles, setMyVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');

  // Get username from token
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUsername(payload.username || 'User');
      } catch (error) {
        setUsername('User');
      }
    }
  }, []);

  // Fetch all dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  /**
   * Fetch all dashboard data from backend APIs
   * Runs in parallel for better performance
   */
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch all data in parallel with individual error handling
      const [statsRes, expiriesRes, vehiclesRes] = await Promise.allSettled([
        dashboardAPI.getStats(),
        dashboardAPI.getExpiries(),
        dashboardAPI.getMyVehicles(),
      ]);

      // Handle stats response
      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data);
      } else if (statsRes.status === 'rejected' && statsRes.reason?.response?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
        return;
      } else {
        // Set default empty stats
        setStats({ total_vehicles: 0, expiring_soon_count: 0, expired_count: 0, active_qr_count: 0 });
      }

      // Handle expiries response
      if (expiriesRes.status === 'fulfilled') {
        setExpiries(expiriesRes.value.data);
      } else {
        setExpiries([]);
      }

      // Handle vehicles response
      if (vehiclesRes.status === 'fulfilled') {
        setMyVehicles(vehiclesRes.value.data);
      } else {
        setMyVehicles([]);
      }

    } catch (err) {
      console.error('Unexpected error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh dashboard data
   * Called when user clicks refresh button
   */
  const handleRefresh = () => {
    fetchDashboardData();
  };

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-box">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={handleRefresh} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state - no vehicles yet
  const hasNoVehicles = stats && stats.total_vehicles === 0;

  if (hasNoVehicles) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>
              <FaUser className="user-icon" /> {username}'s Dashboard
            </h1>
            <p className="dashboard-subtitle">Control & Alert Center</p>
          </div>
        </div>

        <div className="empty-state-dashboard">
          <div className="empty-state-icon">🚗</div>
          <h2>Welcome to DriveData!</h2>
          <p className="empty-state-text">
            You haven't added any vehicles yet. Start by adding your first vehicle to track insurance, pollution certificates, and generate QR codes.
          </p>
          <button 
            onClick={() => navigate('/add-vehicle')} 
            className="btn btn-primary btn-large"
          >
            Add Your First Vehicle
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <h1>
            <FaUser className="user-icon" /> {username}'s Dashboard
          </h1>
          <p className="dashboard-subtitle">Control & Alert Center - Your Vehicles Only</p>
        </div>
        <button onClick={handleRefresh} className="btn btn-secondary refresh-btn">
          🔄 Refresh
        </button>
      </div>

      {/* Overview Statistics Cards */}
      <section className="dashboard-section">
        <h2 className="section-title">Your Vehicle Overview</h2>
        <StatsCards stats={stats} />
      </section>

      {/* Expiry Alerts Table */}
      <section className="dashboard-section">
        <h2 className="section-title">Your Expiry Alerts</h2>
        {expiries.length > 0 ? (
          <ExpiryTable expiries={expiries} />
        ) : (
          <div className="no-data-message">
            <p>No expiry alerts for your vehicles.</p>
          </div>
        )}
      </section>

      {/* My Vehicles Quick Access */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Recently Added Vehicles</h2>
          <button 
            onClick={() => navigate('/vehicles')} 
            className="btn btn-link"
          >
            View All →
          </button>
        </div>
        <MyVehiclesMini vehicles={myVehicles} />
      </section>
    </div>
  );
};

export default Dashboard;
