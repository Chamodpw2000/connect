import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Clear the refresh token cookie
    (await cookies()).set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      expires: new Date(0) // Set to past date to delete
    });

    // Clear the access token cookie
    (await cookies()).set('accessToken', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      expires: new Date(0) // Set to past date to delete
    });

    return Response.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    console.error('Logout error:', error);
    return Response.json({ error: 'Logout failed' }, { status: 500 });
  }
}