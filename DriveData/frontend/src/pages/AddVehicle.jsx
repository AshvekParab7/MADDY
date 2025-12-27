import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehicleAPI } from '../services/api';
import './AddVehicle.css';

const AddVehicle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setVehicleData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      
      // Append image files only if they exist
      ['front_photo', 'back_photo', 'side_photo', 'owner_photo'].forEach(field => {
        if (vehicleData[field] && vehicleData[field] instanceof File) {
          formData.append(field, vehicleData[field]);
        }
      });

      const response = await vehicleAPI.createVehicle(formData);
      setSuccess('Vehicle added successfully! Redirecting...');
      setTimeout(() => {
        navigate(`/vehicle/${response.data.id}`);
      }, 2000);
    } catch (err) {
      let errorMsg = 'Failed to add vehicle. Please check all fields.';
      
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
      console.error('Error creating vehicle:', err);
      console.error('Error response:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-vehicle-page">
      <div className="container">
        <h1>Add New Vehicle</h1>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="form-container">
          {/* Owner Information */}
          <div className="card">
            <h2>Owner Information (Optional)</h2>
            <p className="info-text">Provide your contact information for display on the QR code page.</p>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="owner_name"
                  value={vehicleData.owner_name}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., John Doe"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="owner_email"
                  value={vehicleData.owner_email}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., john@example.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  name="owner_phone"
                  value={vehicleData.owner_phone}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., +1 234 567 8900"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="owner_address"
                  value={vehicleData.owner_address}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., 123 Main St"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Owner Photo</label>
              <input
                type="file"
                name="owner_photo"
                onChange={handleChange}
                className="input"
                accept="image/*"
              />
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="card">
            <h2>Vehicle Details</h2>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Registration Number *</label>
                <input
                  type="text"
                  name="registration_number"
                  value={vehicleData.registration_number}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., AB12CD3456"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Make *</label>
                <input
                  type="text"
                  name="make"
                  value={vehicleData.make}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., Toyota"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Model *</label>
                <input
                  type="text"
                  name="model"
                  value={vehicleData.model}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., Camry"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Year *</label>
                <input
                  type="number"
                  name="year"
                  value={vehicleData.year}
                  onChange={handleChange}
                  className="input"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Color *</label>
                <input
                  type="text"
                  name="color"
                  value={vehicleData.color}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., Blue"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Fuel Type *</label>
                <select
                  name="fuel_type"
                  value={vehicleData.fuel_type}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="cng">CNG</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Engine Number *</label>
                <input
                  type="text"
                  name="engine_number"
                  value={vehicleData.engine_number}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Chassis Number *</label>
                <input
                  type="text"
                  name="chassis_number"
                  value={vehicleData.chassis_number}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
            </div>

            <h3>Important Dates</h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Registration Date *</label>
                <input
                  type="date"
                  name="registration_date"
                  value={vehicleData.registration_date}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Insurance Expiry *</label>
                <input
                  type="date"
                  name="insurance_expiry"
                  value={vehicleData.insurance_expiry}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Pollution Certificate Expiry *</label>
              <input
                type="date"
                name="pollution_certificate_expiry"
                value={vehicleData.pollution_certificate_expiry}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <h3>Vehicle Photos</h3>

            <div className="form-group">
              <label className="form-label">Front Photo</label>
              <input
                type="file"
                name="front_photo"
                onChange={handleChange}
                className="input"
                accept="image/*"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Back Photo</label>
              <input
                type="file"
                name="back_photo"
                onChange={handleChange}
                className="input"
                accept="image/*"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Side Photo</label>
              <input
                type="file"
                name="side_photo"
                onChange={handleChange}
                className="input"
                accept="image/*"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding Vehicle...' : 'Add Vehicle & Generate Logo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicle;
