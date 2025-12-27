import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { vehicleAPI } from '../services/api';
import './AddVehicle.css';

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [vehicleData, setVehicleData] = useState({
    registration_number: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    fuel_type: 'petrol',
    engine_number: '',
    chassis_number: '',
    owner_name: '',
    owner_email: '',
    owner_phone: '',
    owner_address: '',
    owner_photo: null,
    insurance_expiry: '',
    pollution_certificate_expiry: '',
    registration_date: '',
    front_photo: null,
    back_photo: null,
    side_photo: null
  });

  const [currentPhotos, setCurrentPhotos] = useState({
    front_photo: null,
    back_photo: null,
    side_photo: null
  });

  const [photoPreview, setPhotoPreview] = useState({
    front_photo: null,
    back_photo: null,
    side_photo: null
  });

  useEffect(() => {
    fetchVehicleData();
  }, [id]);

  const fetchVehicleData = async () => {
    try {
      setLoading(true);
      const response = await vehicleAPI.getVehicle(id);
      const data = response.data;
      
      setVehicleData({
        registration_number: data.registration_number || '',
        make: data.make || '',
        model: data.model || '',
        year: data.year || new Date().getFullYear(),
        color: data.color || '',
        fuel_type: data.fuel_type || 'petrol',
        engine_number: data.engine_number || '',
        chassis_number: data.chassis_number || '',
        owner_name: data.owner_name || '',
        owner_email: data.owner_email || '',
        owner_phone: data.owner_phone || '',
        owner_address: data.owner_address || '',
        owner_photo: null,
        insurance_expiry: data.insurance_expiry || '',
        pollution_certificate_expiry: data.pollution_certificate_expiry || '',
        registration_date: data.registration_date || '',
        front_photo: null,
        back_photo: null,
        side_photo: null
      });

      // Store current photo URLs
      setCurrentPhotos({
        front_photo: data.front_photo ? `http://localhost:8000${data.front_photo}` : null,
        back_photo: data.back_photo ? `http://localhost:8000${data.back_photo}` : null,
        side_photo: data.side_photo ? `http://localhost:8000${data.side_photo}` : null
      });

      setError('');
    } catch (err) {
      setError('Failed to load vehicle details.');
      console.error('Error fetching vehicle:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleChange = (e) => {
    const { name, value, files } = e.target;
    setVehicleData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));

    // Handle photo preview
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(prev => ({
          ...prev,
          [name]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      
      // Append all text/number fields
      const textFields = [
        'registration_number', 'make', 'model', 'year', 'color', 
        'fuel_type', 'engine_number', 'chassis_number',
        'owner_name', 'owner_email', 'owner_phone', 'owner_address',
        'insurance_expiry', 'pollution_certificate_expiry', 'registration_date'
      ];
      
      textFields.forEach(field => {
        if (vehicleData[field] !== null && vehicleData[field] !== '') {
          formData.append(field, vehicleData[field]);
        }
      });
      
      // Append image files only if they were selected
      ['front_photo', 'back_photo', 'side_photo', 'owner_photo'].forEach(field => {
        if (vehicleData[field] && vehicleData[field] instanceof File) {
          formData.append(field, vehicleData[field]);
        }
      });

      await vehicleAPI.updateVehicle(id, formData);
      setSuccess('Vehicle updated successfully! Redirecting...');
      setTimeout(() => {
        navigate(`/vehicle/${id}`);
      }, 2000);
    } catch (err) {
      let errorMsg = 'Failed to update vehicle. Please check all fields.';
      
      if (err.response?.data) {
        if (typeof err.response.data === 'object' && !err.response.data.detail) {
          const errors = Object.entries(err.response.data)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join(' | ');
          errorMsg = errors || errorMsg;
        } else {
          errorMsg = err.response.data.detail || err.response.data.message || errorMsg;
        }
      }
      
      setError(errorMsg);
      console.error('Error updating vehicle:', err);
      console.error('Error response:', err.response?.data);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="add-vehicle-container">
        <div className="loading">Loading vehicle data...</div>
      </div>
    );
  }

  return (
    <div className="add-vehicle-container">
      <button className="back-button" onClick={() => navigate(`/vehicle/${id}`)}>
        <FaArrowLeft /> Back to Vehicle
      </button>

      <div className="form-wrapper">
        <h1>Edit Vehicle Information</h1>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Vehicle Information Section */}
          <div className="form-section">
            <h2>Vehicle Details</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="registration_number">Registration Number *</label>
                <input
                  type="text"
                  id="registration_number"
                  name="registration_number"
                  value={vehicleData.registration_number}
                  onChange={handleVehicleChange}
                  required
                  disabled
                  className="disabled-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="make">Make *</label>
                <input
                  type="text"
                  id="make"
                  name="make"
                  value={vehicleData.make}
                  onChange={handleVehicleChange}
                  required
                  disabled
                  className="disabled-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="model">Model *</label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={vehicleData.model}
                  onChange={handleVehicleChange}
                  required
                  disabled
                  className="disabled-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="year">Year *</label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={vehicleData.year}
                  onChange={handleVehicleChange}
                  required
                  disabled
                  className="disabled-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="color">Color</label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={vehicleData.color}
                  onChange={handleVehicleChange}
                  disabled
                  className="disabled-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="fuel_type">Fuel Type</label>
                <select
                  id="fuel_type"
                  name="fuel_type"
                  value={vehicleData.fuel_type}
                  onChange={handleVehicleChange}
                  disabled
                  className="disabled-input"
                >
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="engine_number">Engine Number</label>
                <input
                  type="text"
                  id="engine_number"
                  name="engine_number"
                  value={vehicleData.engine_number}
                  onChange={handleVehicleChange}
                  disabled
                  className="disabled-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="chassis_number">Chassis Number</label>
                <input
                  type="text"
                  id="chassis_number"
                  name="chassis_number"
                  value={vehicleData.chassis_number}
                  onChange={handleVehicleChange}
                  disabled
                  className="disabled-input"
                />
              </div>
            </div>
          </div>

          {/* Owner Information Section */}
          <div className="form-section">
            <h2>Owner Information (Optional)</h2>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
              Update your contact information for display on the QR code page.
            </p>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="owner_name">Full Name</label>
                <input
                  type="text"
                  id="owner_name"
                  name="owner_name"
                  value={vehicleData.owner_name}
                  onChange={handleVehicleChange}
                  placeholder="e.g., John Doe"
                />
              </div>

              <div className="form-group">
                <label htmlFor="owner_email">Email</label>
                <input
                  type="email"
                  id="owner_email"
                  name="owner_email"
                  value={vehicleData.owner_email}
                  onChange={handleVehicleChange}
                  placeholder="e.g., john@example.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="owner_phone">Phone</label>
                <input
                  type="tel"
                  id="owner_phone"
                  name="owner_phone"
                  value={vehicleData.owner_phone}
                  onChange={handleVehicleChange}
                  placeholder="e.g., +1 234 567 8900"
                />
              </div>

              <div className="form-group">
                <label htmlFor="owner_address">Address</label>
                <input
                  type="text"
                  id="owner_address"
                  name="owner_address"
                  value={vehicleData.owner_address}
                  onChange={handleVehicleChange}
                  placeholder="e.g., 123 Main St"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="owner_photo">Owner Photo</label>
              <input
                type="file"
                id="owner_photo"
                name="owner_photo"
                onChange={handleVehicleChange}
                accept="image/*"
              />
            </div>
          </div>

          {/* Dates Section */}
          <div className="form-section">
            <h2>Document Dates</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="registration_date">Registration Date</label>
                <input
                  type="date"
                  id="registration_date"
                  name="registration_date"
                  value={vehicleData.registration_date}
                  onChange={handleVehicleChange}
                  disabled
                  className="disabled-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="insurance_expiry">Insurance Expiry Date</label>
                <input
                  type="date"
                  id="insurance_expiry"
                  name="insurance_expiry"
                  value={vehicleData.insurance_expiry}
                  onChange={handleVehicleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pollution_certificate_expiry">Pollution Certificate Expiry</label>
                <input
                  type="date"
                  id="pollution_certificate_expiry"
                  name="pollution_certificate_expiry"
                  value={vehicleData.pollution_certificate_expiry}
                  onChange={handleVehicleChange}
                />
              </div>
            </div>
          </div>

          {/* Vehicle Photos Section */}
          <div className="form-section">
            <h2>Vehicle Photos</h2>
            <p className="section-info">Upload new photos to replace existing ones. If left blank, current photos will be kept.</p>

            {/* Front Photo */}
            <div className="photo-upload-group">
              <h3>Front View</h3>
              <div className="photo-preview-container">
                {photoPreview.front_photo ? (
                  <div className="photo-preview">
                    <img src={photoPreview.front_photo} alt="Front preview" />
                    <p className="preview-label">New Photo</p>
                  </div>
                ) : currentPhotos.front_photo ? (
                  <div className="photo-preview">
                    <img src={currentPhotos.front_photo} alt="Current front" />
                    <p className="preview-label">Current Photo</p>
                  </div>
                ) : (
                  <div className="photo-placeholder">No photo available</div>
                )}
              </div>
              <input
                type="file"
                name="front_photo"
                accept="image/*"
                onChange={handleVehicleChange}
              />
            </div>

            {/* Back Photo */}
            <div className="photo-upload-group">
              <h3>Back View</h3>
              <div className="photo-preview-container">
                {photoPreview.back_photo ? (
                  <div className="photo-preview">
                    <img src={photoPreview.back_photo} alt="Back preview" />
                    <p className="preview-label">New Photo</p>
                  </div>
                ) : currentPhotos.back_photo ? (
                  <div className="photo-preview">
                    <img src={currentPhotos.back_photo} alt="Current back" />
                    <p className="preview-label">Current Photo</p>
                  </div>
                ) : (
                  <div className="photo-placeholder">No photo available</div>
                )}
              </div>
              <input
                type="file"
                name="back_photo"
                accept="image/*"
                onChange={handleVehicleChange}
              />
            </div>

            {/* Side Photo */}
            <div className="photo-upload-group">
              <h3>Side View</h3>
              <div className="photo-preview-container">
                {photoPreview.side_photo ? (
                  <div className="photo-preview">
                    <img src={photoPreview.side_photo} alt="Side preview" />
                    <p className="preview-label">New Photo</p>
                  </div>
                ) : currentPhotos.side_photo ? (
                  <div className="photo-preview">
                    <img src={currentPhotos.side_photo} alt="Current side" />
                    <p className="preview-label">Current Photo</p>
                  </div>
                ) : (
                  <div className="photo-placeholder">No photo available</div>
                )}
              </div>
              <input
                type="file"
                name="side_photo"
                accept="image/*"
                onChange={handleVehicleChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
              disabled={submitting}
            >
              {submitting ? 'Updating...' : 'Update Vehicle'}
            </button>
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => navigate(`/vehicle/${id}`)}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVehicle;
