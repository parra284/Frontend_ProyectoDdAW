// API service for handling requests
import axios from 'axios';
import { refreshTokenIfNeeded } from './authUtils';

const API_URL = 'http://localhost:3000/api';

// Create axios instance with baseURL
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding token
apiClient.interceptors.request.use(
  async (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('accessToken');
    
    // If token exists, add to headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 (Unauthorized) and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Try to refresh token - force refresh since we got a 401
      const refreshed = await refreshTokenIfNeeded(true);
      
      if (refreshed) {
        // Update token in header
        const newToken = localStorage.getItem('accessToken');
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        
        // Retry the original request
        return apiClient(originalRequest);
      }
      
      // If token refresh failed, redirect to login
      console.log('Token refresh failed, redirecting to login');
      
      // To avoid potential redirect loops, clear storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      // Redirect to login page
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
