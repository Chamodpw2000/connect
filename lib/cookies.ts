import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Interface for your JWT payload
export interface AccessTokenPayload extends JwtPayload {
  userId: string;
  email?: string;
  role?: string;
}

/**
 * Server-side utility to get cookies
 * Use this in API routes and server components
 */
export async function getServerCookie(name: string): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value || null;
  } catch (error) {
    console.error('Error getting server cookie:', error);
    return null;
  }
}

/**
 * Get access token from request (tries cookies first, then headers)
 * Use this in API routes for authentication
 */
export function getAccessTokenFromRequest(req: NextRequest): string | null {
  // First try to get from cookies
  const tokenFromCookie = req.cookies.get("accessToken")?.value;
  if (tokenFromCookie) {
    return tokenFromCookie;
  }
  
  // If not in cookies, try header
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.replace("Bearer ", "");
  }
  
  return null;
}

/**
 * Verify and decode access token
 * Returns the decoded payload if valid, null if invalid/expired
 */
export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      console.error('ACCESS_TOKEN_SECRET is not defined');
      return null;
    }
    
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as AccessTokenPayload;

    console.log(decoded,"dddddddddddddd");
    
    console.log('Token verified successfully:', { userId: decoded.userId });
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Get and verify access token from request
 * Returns decoded payload if token is valid, null otherwise
 */
export function getVerifiedTokenFromRequest(req: NextRequest): AccessTokenPayload | null {
  const token = getAccessTokenFromRequest(req);
  if (!token) {
    console.log('No access token found in request');
    return null;
  }
  
  return verifyAccessToken(token);
}

/**
 * Get and verify access token from server-side cookies
 * Use this in server components and API routes
 */
export async function getVerifiedServerToken(): Promise<AccessTokenPayload | null> {
  const token = await getServerAccessToken();
  if (!token) {
    console.log('No access token found in server cookies');
    return null;
  }
  
  return verifyAccessToken(token);
}

/**
 * Authentication middleware helper
 * Returns user data if authenticated, null if not
 */
export async function authenticateRequest(req: NextRequest): Promise<{
  isAuthenticated: boolean;
  user: AccessTokenPayload | null;
  error?: string;
}> {
  const tokenData = getVerifiedTokenFromRequest(req);
  
  if (!tokenData) {
    return {
      isAuthenticated: false,
      user: null,
      error: 'No valid access token provided'
    };
  }
  
  return {
    isAuthenticated: true,
    user: tokenData
  };
}

/**
 * Server-side utility to set cookies
 * Use this in API routes
 */
export async function setServerCookie(
  name: string, 
  value: string, 
  options: {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    path?: string;
    maxAge?: number;
  } = {}
): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.set(name, value, {
      httpOnly: options.httpOnly ?? false,
      secure: options.secure ?? (process.env.NODE_ENV === 'production'),
      sameSite: options.sameSite ?? 'strict',
      path: options.path ?? '/',
      maxAge: options.maxAge
    });
  } catch (error) {
    console.error('Error setting server cookie:', error);
  }
}

/**
 * Server-side utility to remove cookies
 * Use this in API routes
 */
export async function removeServerCookie(name: string): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(name);
  } catch (error) {
    console.error('Error removing server cookie:', error);
  }
}

/**
 * Get access token from cookies (server-side)
 */
export async function getServerAccessToken(): Promise<string | null> {
  const token = await getServerCookie('accessToken');
  console.log('getServerAccessToken result:', token ? 'Token found' : 'No token found');
  return token;
}

/**
 * Get refresh token from cookies (server-side)
 */
export async function getServerRefreshToken(): Promise<string | null> {
  return await getServerCookie('refreshToken');
}