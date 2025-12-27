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



  const handleVehicleSubmit = async (e) => {
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
      // More detailed error handling
      let errorMsg = 'Failed to add vehicle. Please check all fields.';
      
      if (err.response?.data) {
        // If there are field-specific errors
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
      console.error('Error status:', err.response?.status);
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

        <div className="form-container">
          {/* Owner Selection/Creation */}
          <div className="card">
            <h2>Owner Information</h2>
            
            {!showOwnerForm ? (
              <div className="form-group">
                <label className="form-label">Select Owner</label>
                <select
                  name="owner_id"
                  value={vehicleData.owner_id}
                  onChange={handleVehicleChange}
                  className="input"
                  required
                >
                  <option value="">Select an owner</option>
                  {owners.map(owner => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name} ({owner.email})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowOwnerForm(true)}
                  className="btn btn-secondary"
                  style={{ marginTop: '10px' }}
                >
                  Add New Owner
                </button>
              </div>
            ) : (
              <form onSubmit={handleOwnerSubmit}>
                <div className="form-group">
                  <label className="form-label">Owner Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={ownerData.name}
                    onChange={handleOwnerChange}
                    className="input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={ownerData.email}
                    onChange={handleOwnerChange}
                    className="input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={ownerData.phone}
                    onChange={handleOwnerChange}
                    className="input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Address *</label>
                  <textarea
                    name="address"
                    value={ownerData.address}
                    onChange={handleOwnerChange}
                    className="input"
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Owner Photo</label>
                  <input
                    type="file"
                    name="photo"
                    onChange={handleOwnerChange}
                    className="input"
                    accept="image/*"
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Owner'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOwnerForm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Vehicle Form */}
          <form onSubmit={handleVehicleSubmit} className="card">
            <h2>Vehicle Details</h2>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Registration Number *</label>
                <input
                  type="text"
                  name="registration_number"
                  value={vehicleData.registration_number}
                  onChange={handleVehicleChange}
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
                  onChange={handleVehicleChange}
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
                  onChange={handleVehicleChange}
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
                  onChange={handleVehicleChange}
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
                  onChange={handleVehicleChange}
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
                  onChange={handleVehicleChange}
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
                  onChange={handleVehicleChange}
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
                  onChange={handleVehicleChange}
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
                  onChange={handleVehicleChange}
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
                  onChange={handleVehicleChange}
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
                onChange={handleVehicleChange}
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
                onChange={handleVehicleChange}
                className="input"
                accept="image/*"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Back Photo</label>
              <input
                type="file"
                name="back_photo"
                onChange={handleVehicleChange}
                className="input"
                accept="image/*"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Side Photo</label>
              <input
                type="file"
                name="side_photo"
                onChange={handleVehicleChange}
                className="input"
                accept="image/*"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading || !vehicleData.owner_id}>
              {loading ? 'Adding Vehicle...' : 'Add Vehicle & Generate Logo'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;
