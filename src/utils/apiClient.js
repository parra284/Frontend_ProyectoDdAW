// API service for handling requests
import axios from 'axios';

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
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Intentar refrescar el token si es posible
      const refreshed = await refreshTokenIfNeeded(true);
      if (refreshed) {
        // Reintentar la solicitud original
        const originalRequest = error.config;
        originalRequest.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
        return apiClient(originalRequest);
      } else {
        // Redirigir al usuario a iniciar sesión si no se puede refrescar el token
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
