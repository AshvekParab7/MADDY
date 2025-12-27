// Test this file to check if backend is running
// Open browser console and check the network tab

import axios from 'axios';

const testBackend = async () => {
  try {
    // Test 1: Check if backend is accessible
    const healthCheck = await axios.get('http://localhost:8000/api/owners/');
    console.log('✅ Backend is accessible');
    console.log('Owners:', healthCheck.data);
    
    // Test 2: Try creating an owner
    const formData = new FormData();
    formData.append('name', 'Test Owner');
    formData.append('email', 'test@example.com');
    formData.append('phone', '1234567890');
    formData.append('address', '123 Test Street');
    
    const createResponse = await await api.post(
  '/owners/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ Owner created successfully:', createResponse.data);
    
  } catch (error) {
    console.error('❌ Error:', error);
    console.error('Response data:', error.response?.data);
    console.error('Status:', error.response?.status);
  }
};

// Uncomment to run test
// testBackend();

export default testBackend;
