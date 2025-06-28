import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const publicRoutes = ['/', '/auth/login', '/auth/signup'];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // ✅ Only allow exact match for '/', or proper prefix for auth routes
  const isPublic =
    pathname === '/' ||
    pathname.startsWith('/auth/login') ||
    pathname.startsWith('/auth/signup');

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  if (token && (pathname === '/auth/login' || pathname === '/auth/signup')) {
    return NextResponse.redirect(new URL('/feed', req.url));
  }

  return NextResponse.next();
}

// ✅ Make sure static assets are excluded
export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
};
