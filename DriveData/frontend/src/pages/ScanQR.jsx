import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaQrcode, FaKeyboard, FaCamera, FaStop } from 'react-icons/fa';
import { Html5Qrcode } from 'html5-qrcode';
import { vehicleAPI } from '../services/api';
import './ScanQR.css';

const ScanQR = () => {
  const navigate = useNavigate();
  const html5QrcodeRef = useRef(null);

  const [scanning, setScanning] = useState(false);
  const [manualInput, setManualInput] = useState(false);
  const [uniqueId, setUniqueId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [scannedText, setScannedText] = useState('');

  /* ================== CLEANUP ON UNMOUNT ================== */
  useEffect(() => {
    return () => {
      if (html5QrcodeRef.current && scanning) {
        stopScanning();
      }
    };
  }, [scanning]);

  /* ================== START CAMERA SCANNER ================== */
  const startScanning = async () => {
    setError('');
    setScannedText('');

    try {
      const html5Qrcode = new Html5Qrcode('qr-reader');
      html5QrcodeRef.current = html5Qrcode;

      await html5Qrcode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          // On successful scan
          setScannedText(decodedText);
          await stopScanning();
          await lookupVehicle(decodedText);
        },
        (errorMessage) => {
          // On scan error (ignore, this fires continuously)
          // console.log('Scan error:', errorMessage);
        }
      );

      setScanning(true);
    } catch (err) {
      console.error('Error starting scanner:', err);
      
      let errorMsg = 'Unable to access camera. ';
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg += 'Please allow camera access in your browser settings.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMsg += 'No camera found on your device.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMsg += 'Camera is already in use by another application.';
      } else if (err.name === 'NotSupportedError') {
        errorMsg += 'Camera is not supported on this device/browser.';
      } else if (err.message && err.message.includes('secure')) {
        errorMsg += 'Camera requires HTTPS. Please use a secure connection.';
      } else {
        errorMsg += 'Please check camera permissions and try again.';
      }
      
      setError(errorMsg);
    }
  };

  /* ================== STOP SCANNER ================== */
  const stopScanning = async () => {
    try {
      if (html5QrcodeRef.current) {
        await html5QrcodeRef.current.stop();
        html5QrcodeRef.current.clear();
        html5QrcodeRef.current = null;
      }
      setScanning(false);
    } catch (err) {
      console.error('Error stopping scanner:', err);
    }
  };

  /* ================== LOOKUP VEHICLE ================== */
  const lookupVehicle = async (id) => {
    setLoading(true);
    setError('');

    try {
      const response = await vehicleAPI.scanQR(id);
      navigate(`/vehicle/${response.data.id}`);
    } catch (err) {
      console.error(err);
      setError('Vehicle not found with this QR code.');
    } finally {
      setLoading(false);
    }
  };

  /* ================== MANUAL ENTRY ================== */
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (uniqueId.trim()) {
      await lookupVehicle(uniqueId.trim());
    }
  };

  return (
    <div className="scan-qr-page">
      <div className="container">
        <h1>Scan Vehicle QR Code</h1>
        <p className="subtitle">
          {scanning
            ? 'Point your camera at the QR code'
            : 'Scan vehicle QR or enter unique ID manually'}
        </p>

        <div className="scan-container card">
          {!scanning && !manualInput && (
            <div className="scan-options">
              <button onClick={startScanning} className="btn btn-primary scan-btn">
                <FaCamera /> Start Camera Scanner
              </button>

              <button
                onClick={() => setManualInput(true)}
                className="btn btn-secondary scan-btn"
              >
                <FaKeyboard /> Enter Manually
              </button>
            </div>
          )}

          {/* QR Reader - Always in DOM, visibility controlled by CSS */}
          <div className="scanner-container" style={{ display: scanning ? 'block' : 'none' }}>
            <div id="qr-reader"></div>
            
            {scanning && (
              <>
                <button
                  onClick={stopScanning}
                  className="btn btn-danger stop-btn"
                  style={{ marginTop: '20px', width: '100%' }}
                >
                  <FaStop /> Stop Scanning
                </button>
                
                {scannedText && (
                  <div className="scanned-result">
                    <strong>Scanned:</strong> {scannedText}
                  </div>
                )}
              </>
            )}
          </div>

          {manualInput && (
            <div className="manual-input-container">
              <form onSubmit={handleManualSubmit}>
                <div className="form-group">
                  <label className="form-label">Vehicle Unique ID</label>
                  <input
                    type="text"
                    value={uniqueId}
                    onChange={(e) => setUniqueId(e.target.value)}
                    className="input"
                    placeholder="UUID from QR code"
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Searching...' : 'Look Up Vehicle'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setManualInput(false);
                      setUniqueId('');
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
          {loading && <div className="loading-message">Looking up vehicle...</div>}
        </div>

        <div className="info-section card">
          <h2>How it works</h2>
          <ol>
            <li>Tap "Start Camera Scanner"</li>
            <li>Allow camera access when prompted</li>
            <li>Point camera at vehicle QR code</li>
            <li>Vehicle details open automatically</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ScanQR;
