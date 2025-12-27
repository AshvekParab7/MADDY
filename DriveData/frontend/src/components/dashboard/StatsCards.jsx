/**
 * StatsCards Component
 * 
 * Displays overview statistics in card format:
 * - Total Vehicles
 * - Expiring Soon
 * - Expired Documents
 * - Active QR Codes
 */

import React from 'react';
import { FaCar, FaExclamationTriangle, FaTimesCircle, FaQrcode } from 'react-icons/fa';
import './StatsCards.css';

const StatsCards = ({ stats }) => {
  // If no stats data, show placeholder
  if (!stats) {
    return (
      <div className="stats-grid">
        <div className="stat-card loading">Loading...</div>
      </div>
    );
  }

  // Define card configurations
  const cards = [
    {
      title: 'Total Vehicles',
      value: stats.total_vehicles,
      icon: <FaCar />,
      color: 'blue',
      description: 'Vehicles in system'
    },
    {
      title: 'Expiring Soon',
      value: stats.expiring_soon_count,
      icon: <FaExclamationTriangle />,
      color: 'yellow',
      description: 'Within 30 days'
    },
    {
      title: 'Expired Documents',
      value: stats.expired_count,
      icon: <FaTimesCircle />,
      color: 'red',
      description: 'Requires attention'
    },
    {
      title: 'Active QR Codes',
      value: stats.active_qr_count,
      icon: <FaQrcode />,
      color: 'green',
      description: 'QR codes generated'
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, index) => (
        <div key={index} className={`stat-card ${card.color}`}>
          {/* Icon */}
          <div className="stat-icon">
            {card.icon}
          </div>
          
          {/* Content */}
          <div className="stat-content">
            <h3 className="stat-title">{card.title}</h3>
            <p className="stat-value">{card.value}</p>
            <p className="stat-description">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
