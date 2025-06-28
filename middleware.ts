import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';


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

    const requestHeaders = new Headers(req.headers);
if (token) {
    if (token.email) requestHeaders.set('x-user-email', token.email);
    if (typeof token.firstName === 'string') requestHeaders.set('x-user-first-name', token.firstName);
    if (typeof token.lastName === 'string') requestHeaders.set('x-user-last-name', token.lastName);
    if (typeof token.role === 'string') requestHeaders.set('x-user-role', token.role);
    if (typeof token.image === 'string') requestHeaders.set('x-user-image', token.image);
  }

  return NextResponse.next(
    {
      request: {
        headers: requestHeaders,
      },
    }
  );
}

// ✅ Make sure static assets are excluded
export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
};
