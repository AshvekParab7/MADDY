import React from 'react';
import { FaCheckCircle, FaShieldAlt, FaMobile, FaDatabase } from 'react-icons/fa';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        <section className="about-hero">
          <h1>About DriveData</h1>
          <p className="lead">
            A modern, professional vehicle information management system designed to 
            simplify vehicle data tracking and access through QR code technology.
          </p>
        </section>

        <section className="mission-section card">
          <h2>Our Mission</h2>
          <p>
            DriveData aims to revolutionize how vehicle information is stored, managed, 
            and accessed. By combining traditional database systems with modern QR code 
            technology, we provide instant access to comprehensive vehicle details anytime, 
            anywhere.
          </p>
        </section>

        <section className="features-list">
          <h2>Why Choose DriveData?</h2>
          <div className="features-grid">
            <div className="feature-item card">
              <FaCheckCircle className="feature-icon" />
              <h3>Easy to Use</h3>
              <p>
                Intuitive interface designed for users of all technical levels. 
                Add vehicles and access information in just a few clicks.
              </p>
            </div>

            <div className="feature-item card">
              <FaShieldAlt className="feature-icon" />
              <h3>Secure & Reliable</h3>
              <p>
                Your data is stored securely with reliable backup systems. 
                Access your information whenever you need it.
              </p>
            </div>

            <div className="feature-item card">
              <FaMobile className="feature-icon" />
              <h3>Mobile Friendly</h3>
              <p>
                Responsive design that works perfectly on all devices. 
                Scan QR codes using your smartphone camera.
              </p>
            </div>

            <div className="feature-item card">
              <FaDatabase className="feature-icon" />
              <h3>Comprehensive Data</h3>
              <p>
                Store all important vehicle information including photos, 
                documents, and compliance dates in one place.
              </p>
            </div>
          </div>
        </section>

        <section className="technology-section card">
          <h2>Technology Stack</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <h4>Backend</h4>
              <ul>
                <li>Django (Python)</li>
                <li>Django REST Framework</li>
                <li>SQLite Database</li>
                <li>QR Code Generation</li>
              </ul>
            </div>
            <div className="tech-item">
              <h4>Frontend</h4>
              <ul>
                <li>React</li>
                <li>Vite</li>
                <li>React Router</li>
                <li>HTML5 QR Code Scanner</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="card cta-card">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of users managing their vehicle information efficiently</p>
            <a href="/add-vehicle" className="btn btn-primary">
              Add Your First Vehicle
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
