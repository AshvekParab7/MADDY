import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaShieldAlt, FaSearch, FaSignOutAlt, FaCheckCircle, 
  FaBan, FaTrash, FaCar, FaEye 
} from 'react-icons/fa';
import axios from 'axios';
import './AdminVehicles.css';

const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem('admin_access_token');
    if (!adminToken) {
      navigate('/admin/login', { replace: true});
      return;
    }
    fetchVehicles();
  }, [navigate]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = vehicles.filter(vehicle =>
        vehicle.registration_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVehicles(filtered);
    } else {
      setFilteredVehicles(vehicles);
    }
  }, [searchTerm, vehicles]);

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const response = await axios.get('http://localhost:8000/api/admin/vehicles/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setVehicles(response.data.vehicles || []);
      setFilteredVehicles(response.data.vehicles || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
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

  const handleVerify = async (vehicleId, regNumber) => {
    if (window.confirm(`Verify vehicle ${regNumber}?`)) {
      try {
        const token = localStorage.getItem('admin_access_token');
        await axios.patch(
          `http://localhost:8000/api/admin/vehicles/${vehicleId}/verify/`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        alert(`Vehicle ${regNumber} verified successfully`);
        fetchVehicles();
      } catch (error) {
        alert('Failed to verify vehicle');
        console.error('Error verifying vehicle:', error);
      }
    }
  };

  const handleBlacklist = async (vehicleId, regNumber) => {
    if (window.confirm(`⚠️ Blacklist vehicle ${regNumber}? This is a serious action.`)) {
      try {
        const token = localStorage.getItem('admin_access_token');
        await axios.patch(
          `http://localhost:8000/api/admin/vehicles/${vehicleId}/blacklist/`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        alert(`Vehicle ${regNumber} blacklisted`);
        fetchVehicles();
      } catch (error) {
        alert('Failed to blacklist vehicle');
        console.error('Error blacklisting vehicle:', error);
      }
    }
  };

  const handleDelete = async (vehicleId, regNumber) => {
    if (window.confirm(`🗑️ PERMANENTLY DELETE vehicle ${regNumber}? This cannot be undone!`)) {
      if (window.confirm(`Are you absolutely sure you want to delete ${regNumber}?`)) {
        try {
          const token = localStorage.getItem('admin_access_token');
          await axios.delete(
            `http://localhost:8000/api/admin/vehicles/${vehicleId}/delete/`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          alert(`Vehicle ${regNumber} deleted`);
          fetchVehicles();
        } catch (error) {
          alert('Failed to delete vehicle');
          console.error('Error deleting vehicle:', error);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading vehicles...</p>
      </div>
    );
  }

  return (
    <div className="admin-vehicles-page">
      <div className="admin-navbar">
        <div className="admin-nav-content">
          <div className="admin-brand">
            <FaShieldAlt />
            <span>Admin Panel</span>
          </div>
          <div className="admin-nav-links">
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/vehicles" className="active">Vehicles</Link>
            <button onClick={handleLogout} className="admin-logout-btn">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-header-section">
          <h1>Vehicle Management</h1>
          <p>Manage all registered vehicles in the system</p>
        </div>

        <div className="search-section">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by registration number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="results-count">
            {filteredVehicles.length} vehicle(s) found
          </div>
        </div>

        {filteredVehicles.length === 0 ? (
          <div className="no-vehicles">
            <FaCar />
            <p>No vehicles found</p>
          </div>
        ) : (
          <div className="vehicles-table-container">
            <table className="admin-vehicles-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Registration No.</th>
                  <th>Make & Model</th>
                  <th>Year</th>
                  <th>Owner</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td>#{vehicle.id}</td>
                    <td className="reg-number">{vehicle.registration_number}</td>
                    <td>{vehicle.make} {vehicle.model}</td>
                    <td>{vehicle.year}</td>
                    <td>{vehicle.owner_name || 'N/A'}</td>
                    <td>
                      <div className="action-buttons">
                        <Link 
                          to={`/vehicle/${vehicle.id}`} 
                          className="action-btn view"
                          title="View Details"
                        >
                          <FaEye />
                        </Link>
                        <button
                          onClick={() => handleVerify(vehicle.id, vehicle.registration_number)}
                          className="action-btn verify"
                          title="Verify Vehicle"
                        >
                          <FaCheckCircle />
                        </button>
                        <button
                          onClick={() => handleBlacklist(vehicle.id, vehicle.registration_number)}
                          className="action-btn blacklist"
                          title="Blacklist Vehicle"
                        >
                          <FaBan />
                        </button>
                        <button
                          onClick={() => handleDelete(vehicle.id, vehicle.registration_number)}
                          className="action-btn delete"
                          title="Delete Vehicle"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVehicles;
