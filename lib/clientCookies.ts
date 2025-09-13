/**
 * Client-side cookie utilities
 * Use these functions in client components only
 */

// Client-side cookie utility functions
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null; // Server-side check
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

export const setCookie = (name: string, value: string, days: number = 1): void => {
  if (typeof document === 'undefined') return; // Server-side check
  
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict${
    process.env.NODE_ENV === 'production' ? ';Secure' : ''
  }`;
};

export const removeCookie = (name: string): void => {
  if (typeof document === 'undefined') return; // Server-side check
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

/**
 * Logout utility function to clear access token cookie
 * Use this in client components for logout
 */
export const clearAuthCookies = (): void => {
  removeCookie('accessToken');
  // Note: refreshToken is HTTP-only and will be cleared by the server
};

/**
 * Get access token from client-side cookie
 */
export const getClientAccessToken = (): string | null => {
  return getCookie('accessToken');
};