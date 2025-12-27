import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaDownload, FaSearch, FaShieldAlt, FaCar, FaEdit, FaTrash } from 'react-icons/fa';
import { vehicleAPI } from '../services/api';
import './VehicleList.css';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searched, setSearched] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Get current user ID from token
  React.useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.user_id);
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      return;
    }

    try {
      setLoading(true);
      setSearched(true);
      const response = await vehicleAPI.getAllVehicles();
      
      // Filter vehicles by registration number
      const filtered = (response.data || []).filter(vehicle =>
        vehicle.registration_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setVehicles(filtered);
    } catch (err) {
      console.error('Error searching vehicles:', err);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const downloadQR = async (vehicle) => {
    if (vehicle.qr_code) {
      window.open(vehicle.qr_code, '_blank');
    }
  };

  const isOwnVehicle = (vehicle) => {
    return vehicle.owner === currentUserId;
  };

  const handleDelete = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await vehicleAPI.deleteVehicle(vehicleId);
        setVehicles(vehicles.filter(v => v.id !== vehicleId));
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        alert('Failed to delete vehicle');
      }
    }
  };

  return (
    <div className="registry-page">
      <div className="registry-header">
        <div className="container">
          <div className="header-content">
            <div className="header-icon">
              <FaShieldAlt />
            </div>
            <div className="header-text">
              <h1>National Vehicle Registry</h1>
              <p>Official Vehicle Records Database</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="search-section">
          <div className="search-header">
            <FaSearch className="section-icon" />
            <h2>Search Vehicle Registry</h2>
          </div>
          <p className="search-description">
            Enter a vehicle registration number to search the national database
          </p>
          
          <div className="search-box">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Enter Registration Number (e.g., MH01AB1234)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                className="search-input"
              />
            </div>
            <button 
              onClick={handleSearch} 
              className="search-button"
              disabled={loading || !searchTerm.trim()}
            >
              {loading ? 'Searching...' : 'Search Registry'}
            </button>
          </div>
        </div>

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Searching vehicle registry...</p>
          </div>
        )}

        {!loading && searched && vehicles.length === 0 && (
          <div className="no-results">
            <FaCar className="no-results-icon" />
            <h3>No Vehicle Found</h3>
            <p>No vehicle with registration number "{searchTerm}" found in the registry.</p>
            <p className="info-text">Please verify the registration number and try again.</p>
          </div>
        )}

        {!loading && !searched && (
          <div className="initial-state">
            <FaCar className="initial-icon" />
            <h3>Search Vehicle Information</h3>
            <p>Enter a registration number above to search for vehicle details in the national registry.</p>
          </div>
        )}

        {!loading && searched && vehicles.length > 0 && (
          <div className="results-section">
            <div className="results-header">
              <h3>Search Results</h3>
              <span className="results-count">{vehicles.length} vehicle(s) found</span>
            </div>

            <div className="vehicles-list">
              {vehicles.map((vehicle) => {
                const isOwner = isOwnVehicle(vehicle);
                
                return (
                  <div key={vehicle.id} className={`registry-card ${isOwner ? 'owned' : ''}`}>
                    {isOwner && <div className="owner-badge">Your Vehicle</div>}
                    
                    <div className="card-layout">
                      <div className="vehicle-image-section">
                        {vehicle.side_photo ? (
                          <img 
                            src={vehicle.side_photo} 
                            alt={`${vehicle.make} ${vehicle.model}`}
                            className="vehicle-photo"
                          />
                        ) : (
                          <div className="no-photo">
                            <FaCar />
                            <span>No Image</span>
                          </div>
                        )}
                      </div>

                      <div className="vehicle-details-section">
                        <div className="detail-row primary">
                          <label>Registration Number</label>
                          <value className="reg-number">{vehicle.registration_number}</value>
                        </div>

                        <div className="detail-grid">
                          <div className="detail-row">
                            <label>Make</label>
                            <value>{vehicle.make}</value>
                          </div>
                          <div className="detail-row">
                            <label>Model</label>
                            <value>{vehicle.model}</value>
                          </div>
                          <div className="detail-row">
                            <label>Year</label>
                            <value>{vehicle.year}</value>
                          </div>
                          <div className="detail-row">
                            <label>Fuel Type</label>
                            <value className="capitalize">{vehicle.fuel_type}</value>
                          </div>
                        </div>

                        {isOwner && (
                          <>
                            <div className="divider"></div>
                            <div className="owner-details">
                              <h4>Owner Information</h4>
                              <div className="detail-grid">
                                {vehicle.owner_name && (
                                  <div className="detail-row">
                                    <label>Name</label>
                                    <value>{vehicle.owner_name}</value>
                                  </div>
                                )}
                                {vehicle.owner_email && (
                                  <div className="detail-row">
                                    <label>Email</label>
                                    <value>{vehicle.owner_email}</value>
                                  </div>
                                )}
                                {vehicle.owner_phone && (
                                  <div className="detail-row">
                                    <label>Phone</label>
                                    <value>{vehicle.owner_phone}</value>
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        )}

                        <div className="card-actions">
                          <Link to={`/vehicle/${vehicle.id}`} className="action-btn view">
                            <FaEye /> View Full Details
                          </Link>
                          
                          {isOwner && (
                            <>
                              <Link to={`/edit-vehicle/${vehicle.id}`} className="action-btn edit">
                                <FaEdit /> Edit
                              </Link>
                              <button 
                                onClick={() => handleDelete(vehicle.id)} 
                                className="action-btn delete"
                              >
                                <FaTrash /> Delete
                              </button>
                              {vehicle.qr_code && (
                                <button 
                                  onClick={() => downloadQR(vehicle)} 
                                  className="action-btn qr"
                                >
                                  <FaDownload /> Download QR
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleList;

