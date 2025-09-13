import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

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
  return await getServerCookie('accessToken');
}

/**
 * Get refresh token from cookies (server-side)
 */
export async function getServerRefreshToken(): Promise<string | null> {
  return await getServerCookie('refreshToken');
}