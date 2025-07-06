import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

function addUserHeadersToRequest(token: any, requestHeaders: Headers) {
  // Add all user details to request headers
  if (token.id) requestHeaders.set('x-user-id', token.id);
  if (token.email) requestHeaders.set('x-user-email', token.email);
  if (typeof token.firstName === 'string') requestHeaders.set('x-user-first-name', token.firstName);
  if (typeof token.lastName === 'string') requestHeaders.set('x-user-last-name', token.lastName);
  if (typeof token.role === 'string') requestHeaders.set('x-user-role', token.role);
  if (typeof token.image === 'string') requestHeaders.set('x-user-image', token.image);
  if (typeof token.bio === 'string') requestHeaders.set('x-user-bio', token.bio);
  if (typeof token.country === 'string') requestHeaders.set('x-user-country', token.country);
  if (typeof token.birthday === 'string') requestHeaders.set('x-user-birthday', token.birthday);
  if (typeof token.miniDescription === 'string') requestHeaders.set('x-user-mini-description', token.miniDescription);
  if (typeof token.createdAt === 'string') requestHeaders.set('x-user-created-at', token.createdAt);
  if (typeof token.updatedAt === 'string') requestHeaders.set('x-user-updated-at', token.updatedAt);
  
  // Add a JSON representation of the complete user object
  const userObject = {
    id: token.id,
    email: token.email,
    firstName: token.firstName,
    lastName: token.lastName,
    role: token.role,
    image: token.image,
    bio: token.bio,
    country: token.country,
    birthday: token.birthday,
    miniDescription: token.miniDescription,
    createdAt: token.createdAt,
    updatedAt: token.updatedAt
  };
  requestHeaders.set('x-user-data', JSON.stringify(userObject));
}

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
    addUserHeadersToRequest(token, requestHeaders);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// ✅ Make sure static assets are excluded
export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
};
