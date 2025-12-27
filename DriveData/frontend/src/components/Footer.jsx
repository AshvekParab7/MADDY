import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaCar } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-section">
          <div className="footer-brand">
            <FaCar className="footer-icon" />
            <h3>DriveData</h3>
          </div>
          <p>Professional vehicle information management system with QR code technology.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/vehicles">Vehicles</a></li>
            <li><a href="/scan">Scan QR</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:info@drivedata.com"><FaEnvelope /> info@drivedata.com</a></li>
            <li><a href="#"><FaGithub /> GitHub</a></li>
            <li><a href="#"><FaLinkedin /> LinkedIn</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2025 DriveData. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
