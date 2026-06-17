import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Debug: log the API URL being used
console.log('🔗 API URL:', API_URL);
console.log('📝 REACT_APP_API_URL env var:', process.env.REACT_APP_API_URL);

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    // Try to get token from userInfo first
    let token = null;
    const userInfo = localStorage.getItem('userInfo');
    
    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        token = parsedUser.token;
      } catch (e) {
        console.error('Failed to parse userInfo:', e);
      }
    }
    
    // Fallback to direct token storage
    if (!token) {
      token = localStorage.getItem('token');
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
