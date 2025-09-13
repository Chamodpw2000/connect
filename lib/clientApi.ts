import axios from 'axios';
import { getCookie, setCookie, removeCookie } from './clientCookies';

/**
 * Client-side Axios instance for use in client components
 * This handles automatic token refresh on the client side
 */
export const createClientApi = () => {
  const clientApi = axios.create({
    baseURL: '/api',
    withCredentials: true // Send cookies (refresh token and access token)
  });

  // Request interceptor: Attach access token from cookies
  clientApi.interceptors.request.use(config => {
    const accessToken = getCookie('accessToken');
    
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  });

  // Response interceptor: Handle 401 and refresh token
  clientApi.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          // Call refresh token endpoint (cookies sent automatically)
          const accessToken = getCookie('accessToken');
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
            // Set access token in cookie (expires in 15 minutes)
            setCookie('accessToken', newAccessToken, 1/96); // 15 minutes in days
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return clientApi(originalRequest); // Retry original request
          }
        } catch (refreshError) {
          // If refresh fails, clear tokens and redirect to login
          removeCookie('accessToken');
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return clientApi;
};

// Default client API instance
export const clientApi = createClientApi();