/**
 * ExpiryTable Component
 * 
 * Displays expiry alerts in table format with status badges
 * Shows insurance and pollution certificate expiry dates
 * 
 * Status Logic:
 * - Green: > 30 days remaining
 * - Yellow: 1-30 days remaining  
 * - Red: Expired (≤ 0 days)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import './ExpiryTable.css';

const ExpiryTable = ({ expiries }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // all, red, yellow, green

  // If no data, show message
  if (!expiries || expiries.length === 0) {
    return (
      <div className="expiry-table-container">
        <p className="no-data">No vehicles found.</p>
      </div>
    );
  }

  /**
   * Get badge class and text based on status
   */
  const getStatusBadge = (status) => {
    const badges = {
      green: { class: 'status-badge green', text: 'Good' },
      yellow: { class: 'status-badge yellow', text: 'Expiring Soon' },
      red: { class: 'status-badge red', text: 'Expired' }
    };
    return badges[status] || { class: 'status-badge', text: 'Unknown' };
  };

  /**
   * Format days remaining text
   */
  const formatDaysRemaining = (days) => {
    if (days === null || days === undefined) return '-';
    if (days < 0) return `Expired ${Math.abs(days)} days ago`;
    if (days === 0) return 'Expires today';
    if (days === 1) return '1 day remaining';
    return `${days} days remaining`;
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /**
   * Filter vehicles based on selected filter
   */
  const filteredExpiries = expiries.filter(vehicle => {
    if (filter === 'all') return true;
    return vehicle.overall_status === filter;
  });

  /**
   * Navigate to vehicle details page
   */
  const handleViewDetails = (vehicleId) => {
    navigate(`/vehicle/${vehicleId}`);
  };

  return (
    <div className="expiry-table-container">
      {/* Filter Buttons */}
      <div className="table-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({expiries.length})
        </button>
        <button 
          className={`filter-btn red ${filter === 'red' ? 'active' : ''}`}
          onClick={() => setFilter('red')}
        >
          Expired ({expiries.filter(v => v.overall_status === 'red').length})
        </button>
        <button 
          className={`filter-btn yellow ${filter === 'yellow' ? 'active' : ''}`}
          onClick={() => setFilter('yellow')}
        >
          Expiring Soon ({expiries.filter(v => v.overall_status === 'yellow').length})
        </button>
        <button 
          className={`filter-btn green ${filter === 'green' ? 'active' : ''}`}
          onClick={() => setFilter('green')}
        >
          Good ({expiries.filter(v => v.overall_status === 'green').length})
        </button>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="expiry-table">
          <thead>
            <tr>
              <th>Vehicle Number</th>
              <th>Insurance Expiry</th>
              <th>Insurance Status</th>
              <th>Pollution Cert Expiry</th>
              <th>Pollution Status</th>
              <th>Overall Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpiries.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-results">
                  No vehicles match the selected filter.
                </td>
              </tr>
            ) : (
              filteredExpiries.map((vehicle) => {
                const insuranceBadge = getStatusBadge(vehicle.insurance_status);
                const pollutionBadge = getStatusBadge(vehicle.pollution_status);
                const overallBadge = getStatusBadge(vehicle.overall_status);

                return (
                  <tr key={vehicle.id} className={`row-${vehicle.overall_status}`}>
                    {/* Vehicle Number */}
                    <td className="vehicle-number">{vehicle.vehicle_number}</td>
                    
                    {/* Insurance Expiry */}
                    <td>
                      <div className="date-cell">
                        <div className="date">{formatDate(vehicle.insurance_expiry)}</div>
                        <div className="days-text">{formatDaysRemaining(vehicle.insurance_days_remaining)}</div>
                      </div>
                    </td>
                    
                    {/* Insurance Status */}
                    <td>
                      <span className={insuranceBadge.class}>
                        {insuranceBadge.text}
                      </span>
                    </td>
                    
                    {/* Pollution Cert Expiry */}
                    <td>
                      <div className="date-cell">
                        <div className="date">{formatDate(vehicle.pollution_certificate_expiry)}</div>
                        <div className="days-text">{formatDaysRemaining(vehicle.pollution_days_remaining)}</div>
                      </div>
                    </td>
                    
                    {/* Pollution Status */}
                    <td>
                      <span className={pollutionBadge.class}>
                        {pollutionBadge.text}
                      </span>
                    </td>
                    
                    {/* Overall Status */}
                    <td>
                      <span className={overallBadge.class}>
                        {overallBadge.text}
                      </span>
                    </td>
                    
                    {/* Action */}
                    <td>
                      <button 
                        className="btn-icon"
                        onClick={() => handleViewDetails(vehicle.id)}
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpiryTable;
