import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import VehicleList from './pages/VehicleList';
import AddVehicle from './pages/AddVehicle';
import EditVehicle from './pages/EditVehicle';
import VehicleDetails from './pages/VehicleDetails';
import ScanQR from './pages/ScanQR';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminVehicles from './pages/AdminVehicles';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/scan" element={<ScanQR />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/vehicles" element={<AdminVehicles />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/vehicles" element={
              <ProtectedRoute>
                <VehicleList />
              </ProtectedRoute>
            } />
            <Route path="/add-vehicle" element={
              <ProtectedRoute>
                <AddVehicle />
              </ProtectedRoute>
            } />
            <Route path="/edit-vehicle/:id" element={
              <ProtectedRoute>
                <EditVehicle />
              </ProtectedRoute>
            } />
            <Route path="/vehicle/:id" element={
              <ProtectedRoute>
                <VehicleDetails />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
