import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaDownload, FaCalendar, FaGasPump, FaPalette, FaUser, FaArrowLeft, FaEdit } from 'react-icons/fa';
import { vehicleAPI } from '../services/api';
import './VehicleDetails.css';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Get current user ID from token or check if admin
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const adminToken = localStorage.getItem('admin_access_token');
    
    if (adminToken) {
      // Admin user
      setIsAdmin(true);
      setCurrentUserId(null); // Admin doesn't have user_id
    } else if (token) {
      // Regular user
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Ensure user_id is a number for consistent comparison
        setCurrentUserId(Number(payload.user_id));
        setIsAdmin(false);
        console.log('Current User ID from token:', Number(payload.user_id));
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }, []);

  useEffect(() => {
    fetchVehicleDetails();
  }, [id]);

  const fetchVehicleDetails = async () => {
    try {
      setLoading(true);
      const response = await vehicleAPI.getVehicle(id);
      setVehicle(response.data);
      setImageTimestamp(Date.now()); // Update timestamp to force image reload
      setError('');
      // Debug: Log owner ID from vehicle
      console.log('Vehicle owner ID:', response.data.owner);
      console.log('Current user ID:', currentUserId);
      console.log('Is owner?', response.data.owner === currentUserId);
    } catch (err) {
      setError('Failed to load vehicle details.');
      console.error('Error fetching vehicle:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (vehicle?.qr_code) {
      window.open(vehicle.qr_code, '_blank');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isExpiringSoon = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (dateString) => {
    return new Date(dateString) < new Date();
  };

  if (loading) {
    return (
      <div className="container">
        <div className="spinner"></div>
        <p style={{ textAlign: 'center' }}>Loading vehicle details...</p>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="container">
        <div className="error-message">{error || 'Vehicle not found'}</div>
        <button onClick={() => navigate('/vehicles')} className="btn btn-primary">
          Back to Vehicles
        </button>
      </div>
    );
  }

  return (
    <div className="vehicle-details-page">
      <div className="container">
        <div className="button-group">
          <button onClick={() => navigate(isAdmin ? '/admin/vehicles' : '/vehicles')} className="btn btn-secondary back-btn">
            <FaArrowLeft /> Back to List
          </button>
          {/* Show edit button for admin OR vehicle owner */}
          {(isAdmin || (vehicle.owner && currentUserId && Number(vehicle.owner) === Number(currentUserId))) && (
            <button onClick={() => navigate(`/edit-vehicle/${id}`)} className="btn btn-primary edit-btn">
              <FaEdit /> Edit Vehicle
            </button>
          )}
        </div>

        <div className="details-grid">
          {/* Main Information Card */}
          <div className="card main-info">
            <h1>{vehicle.make} {vehicle.model}</h1>
            <p className="registration-big">{vehicle.registration_number}</p>

            <div className="info-grid">
              <div className="info-item">
                <FaCalendar className="info-icon" />
                <div>
                  <span className="info-label">Year</span>
                  <span className="info-value">{vehicle.year}</span>
                </div>
              </div>

              <div className="info-item">
                <FaGasPump className="info-icon" />
                <div>
                  <span className="info-label">Fuel Type</span>
                  <span className="info-value">{vehicle.fuel_type}</span>
                </div>
              </div>

              <div className="info-item">
                <FaPalette className="info-icon" />
                <div>
                  <span className="info-label">Color</span>
                  <span className="info-value">{vehicle.color}</span>
                </div>
              </div>
            </div>

            <div className="technical-info">
              <h3>Technical Details</h3>
              <p><strong>Engine Number:</strong> {vehicle.engine_number}</p>
              <p><strong>Chassis Number:</strong> {vehicle.chassis_number}</p>
              <p><strong>Registration Date:</strong> {formatDate(vehicle.registration_date)}</p>
            </div>
          </div>

          {/* Owner Information */}
          <div className="card owner-info">
            <h2><FaUser /> Owner Information</h2>
            {vehicle.owner_photo && (
              <img
                src={vehicle.owner_photo}
                alt={vehicle.owner_name}
                className="owner-photo"
              />
            )}
            <div className="owner-details">
              <p><strong>Name:</strong> {vehicle.owner_name || 'N/A'}</p>
              <p><strong>Email:</strong> {vehicle.owner_email || 'N/A'}</p>
              <p><strong>Phone:</strong> {vehicle.owner_phone || 'N/A'}</p>
              <p><strong>Address:</strong> {vehicle.owner_address || 'N/A'}</p>
            </div>
          </div>

          

          {/* Important Dates */}
          <div className="card dates-info">
            <h2>Important Dates</h2>
            
            <div className={`date-item ${isExpired(vehicle.insurance_expiry) ? 'expired' : isExpiringSoon(vehicle.insurance_expiry) ? 'expiring' : ''}`}>
              <strong>Insurance Expiry:</strong>
              <span>{formatDate(vehicle.insurance_expiry)}</span>
              {isExpired(vehicle.insurance_expiry) && <span className="status-badge">Expired</span>}
              {isExpiringSoon(vehicle.insurance_expiry) && <span className="status-badge warning">Expiring Soon</span>}
            </div>

            <div className={`date-item ${isExpired(vehicle.pollution_certificate_expiry) ? 'expired' : isExpiringSoon(vehicle.pollution_certificate_expiry) ? 'expiring' : ''}`}>
              <strong>Pollution Certificate:</strong>
              <span>{formatDate(vehicle.pollution_certificate_expiry)}</span>
              {isExpired(vehicle.pollution_certificate_expiry) && <span className="status-badge">Expired</span>}
              {isExpiringSoon(vehicle.pollution_certificate_expiry) && <span className="status-badge warning">Expiring Soon</span>}
            </div>
          </div>

             {/* QR Code */}
          <div className="card qr-logo-section">
            <h2>QR Code</h2>
            <p className="section-description">Scan the QR code for instant access to vehicle details</p>
            
            {!vehicle.qr_code ? (
              <div className="no-qr-logo">
                <p>QR Code is being generated...</p>
                <p className="help-text">Refresh the page if it doesn't appear in a few seconds.</p>
              </div>
            ) : (
              <div className="qr-logo-grid">
                <div className="qr-item">
                  <h3>Vehicle QR Code</h3>
                  <img 
                    src={vehicle.qr_code} 
                    alt="Vehicle QR Code"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="image-error" style={{display: 'none'}}>QR Code not available</div>
                  <button onClick={downloadQR} className="btn btn-primary">
                    <FaDownload /> Download QR Code
                  </button>
                  <p className="qr-hint">Scan to view complete vehicle information</p>
                </div>
              </div>
            )}
          </div>

          {/* Vehicle Photos */}
          <div className="card vehicle-photos-section">
            <h2>Vehicle Photos</h2>
            <div className="photos-grid">
              {vehicle.front_photo && (
                <div className="photo-item">
                  <h3 className="photo-label">Front View</h3>
                  <img 
                    src={vehicle.front_photo} 
                    alt="Front view"
                    className="vehicle-photo-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="image-error" style={{display: 'none'}}>Image not available</div>
                </div>
              )}
              
              {vehicle.back_photo && (
                <div className="photo-item">
                  <h3 className="photo-label">Back View</h3>
                  <img 
                    src={vehicle.back_photo} 
                    alt="Back view"
                    className="vehicle-photo-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="image-error" style={{display: 'none'}}>Image not available</div>
                </div>
              )}

              {vehicle.side_photo && (
                <div className="photo-item">
                  <h3 className="photo-label">Side View</h3>
                  <img 
                    src={vehicle.side_photo} 
                    alt="Side view"
                    className="vehicle-photo-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="image-error" style={{display: 'none'}}>Image not available</div>
                </div>
              )}
            </div>

            {!vehicle.front_photo && !vehicle.back_photo && !vehicle.side_photo && (
              <p style={{ textAlign: 'center', color: 'var(--gray)', padding: '20px' }}>
                No photos uploaded for this vehicle.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
