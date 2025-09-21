import { NextRequest, NextResponse } from 'next/server';

import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if user has valid access token in cookies
  const accessToken = req.cookies.get('accessToken')?.value;
  console.log('Middleware - Access Token:', accessToken);
  
  let isAuthenticated = false;

  if (accessToken && process.env.ACCESS_TOKEN_SECRET) {
    console.log('Middleware - Verifying access token...');
    try {
      // jose expects a Uint8Array for the secret
      const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
      await jwtVerify(accessToken, secret);
      isAuthenticated = true;
      console.log('Middleware - User is authenticated');
    } catch (error) {
      console.log('Middleware - Access token verification failed:', error);
      isAuthenticated = false;
    }
  }

  // ✅ Only allow exact match for '/', or proper prefix for auth routes
  const isPublic =
    pathname === '/' ||
    pathname.startsWith('/auth/login') ||
    pathname.startsWith('/auth/signup');

  if (!isAuthenticated && !isPublic) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  if (isAuthenticated && (pathname === '/auth/login' || pathname === '/auth/signup')) {
    return NextResponse.redirect(new URL('/feed', req.url));
  }

  return NextResponse.next();
}

// ✅ Make sure static assets are excluded
export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
};
