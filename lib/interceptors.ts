
import axios from 'axios';
import { getServerAccessToken } from './cookies';

// Create server-side Axios instance for API routes and server components
export const createServerApi = async () => {
  const serverApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    withCredentials: true
  });

  // Request interceptor for server-side: Attach access token from cookies
  serverApi.interceptors.request.use(async config => {
    const accessToken = await getServerAccessToken();
    
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  });

  // Response interceptor: Handle 401 and refresh token automatically
  serverApi.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      
      // If we get 401 and haven't already tried to refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // Call refresh token endpoint
          const refreshResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/refresh-token`,
            {},
            {
              withCredentials: true, // Send cookies (including refreshToken)
              headers: {
                'Authorization': originalRequest.headers['Authorization'] || ''
              }
            }
          );

          const newAccessToken = refreshResponse.data.accessToken;
          if (newAccessToken) {
            // Update the Authorization header for the original request
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            
            // Retry the original request with new token
            return serverApi(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // If refresh fails, the error will be propagated
          // You might want to redirect to login or handle this differently
        }
      }
      
      return Promise.reject(error);
    }
  );

  return serverApi;
};

// Default export for server-side API instance
export default createServerApi;

