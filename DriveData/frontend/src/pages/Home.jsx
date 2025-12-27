import React from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaQrcode, FaDatabase, FaShieldAlt } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <h1 className="fade-in">Welcome to DriveData</h1>
          <p className="hero-subtitle fade-in">
            Professional Vehicle Information Management System
          </p>
          <p className="hero-description fade-in">
            Generate unique QR code logos for your vehicles and access complete
            vehicle information instantly by scanning
          </p>
          <div className="hero-buttons fade-in">
            <Link to="/add-vehicle" className="btn btn-primary">
              Add Vehicle
            </Link>
            <Link to="/scan" className="btn btn-secondary">
              Scan QR Code
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            <div className="feature-card card fade-in">
              <div className="feature-icon">
                <FaCar />
              </div>
              <h3>Vehicle Management</h3>
              <p>
                Store comprehensive vehicle information including photos,
                owner details, and important documents
              </p>
            </div>

            <div className="feature-card card fade-in">
              <div className="feature-icon">
                <FaQrcode />
              </div>
              <h3>QR Code Technology</h3>
              <p>
                Generate unique QR code embedded logos for each vehicle
                for instant information access
              </p>
            </div>

            
            <div className="feature-card card fade-in">
              <div className="feature-icon">
                <FaShieldAlt />
              </div>
              <h3>Insurance & Compliance</h3>
              <p>
                Track insurance expiry, pollution certificates, and
                other important compliance dates
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step card fade-in">
              <div className="step-number">1</div>
              <h3>Add Vehicle</h3>
              <p>Enter vehicle details, owner information, and upload photos</p>
            </div>

            <div className="step card fade-in">
              <div className="step-number">2</div>
              <h3>Generate Logo</h3>
              <p>System automatically creates a unique logo with embedded QR code</p>
            </div>

            <div className="step card fade-in">
              <div className="step-number">3</div>
              <h3>Scan & Access</h3>
              <p>Scan the QR code anytime to instantly view all vehicle details</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
