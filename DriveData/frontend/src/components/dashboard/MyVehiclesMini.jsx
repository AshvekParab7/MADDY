/**
 * MyVehiclesMini Component
 * 
 * Compact list of user's vehicles with quick actions:
 * - View vehicle details
 * - Download QR code
 * - Download logo
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaQrcode, FaDownload, FaEye, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './MyVehiclesMini.css';

const MyVehiclesMini = ({ vehicles }) => {
  const navigate = useNavigate();

  // If no vehicles, show message
  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="my-vehicles-mini">
        <p className="no-vehicles">No vehicles added yet.</p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/add-vehicle')}
        >
          Add Your First Vehicle
        </button>
      </div>
    );
  }

  /**
   * Download QR code
   */
  const handleDownloadQR = (url, vehicleNumber) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      alert('QR code not available for this vehicle');
    }
  };

  /**
   * Download Logo
   */
  const handleDownloadLogo = (url, vehicleNumber) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      alert('Logo not available for this vehicle');
    }
  };

  /**
   * View vehicle details
   */
  const handleViewDetails = (vehicleId) => {
    navigate(`/vehicle/${vehicleId}`);
  };

  return (
    <div className="my-vehicles-mini">
      <div className="vehicles-grid">
        {vehicles.slice(0, 6).map((vehicle) => (
          <div key={vehicle.id} className="vehicle-mini-card">
            {/* Header with QR Status */}
            <div className="card-header">
              <h3 className="vehicle-number">{vehicle.vehicle_number}</h3>
              <span className={`qr-status ${vehicle.qr_status === 'Active' ? 'active' : 'inactive'}`}>
                {vehicle.qr_status === 'Active' ? (
                  <><FaCheckCircle /> Active</>
                ) : (
                  <><FaTimesCircle /> Inactive</>
                )}
              </span>
            </div>

            {/* Vehicle Make/Model */}
            <p className="vehicle-make-model">{vehicle.make_model}</p>

            {/* Action Buttons */}
            <div className="card-actions">
              <button 
                className="btn-action primary"
                onClick={() => handleViewDetails(vehicle.id)}
                title="View Details"
              >
                <FaEye /> View
              </button>
              
              {vehicle.qr_download_url && (
                <button 
                  className="btn-action secondary"
                  onClick={() => handleDownloadQR(vehicle.qr_download_url, vehicle.vehicle_number)}
                  title="Download QR Code"
                >
                  <FaQrcode /> QR
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Show "View All" if more than 6 vehicles */}
      {vehicles.length > 6 && (
        <div className="view-all-container">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/vehicles')}
          >
            View All {vehicles.length} Vehicles →
          </button>
        </div>
      )}
    </div>
  );
};

export default MyVehiclesMini;
