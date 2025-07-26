
import axios from 'axios';

// Create Axios instance for authenticated requests
const api = axios.create({
  baseURL: '/api', // Adjust if needed
  withCredentials: true // Send cookies (refresh token)
});

// Request interceptor: Attach access token from localStorage
api.interceptors.request.use(config => {
  const accessToken = localStorage.getItem('accessToken');

  
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor: Handle 401 and refresh token
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Call refresh token endpoint (cookie sent automatically)
        const accessToken = localStorage.getItem('accessToken');
        const res = await axios.post(
          '/api/auth/refresh-token',
          {},
          {
            withCredentials: true,
            headers: {
              'Authorization': accessToken ? `Bearer ${accessToken}` : ''
            }
          }
        );
        const newAccessToken = res.data.accessToken;
        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken);
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest); // Retry original request
        }
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        window.location.href = '/login'; // Adjust redirect as needed
       
      }
    }
    return Promise.reject(error);
  }
);


export default api;

