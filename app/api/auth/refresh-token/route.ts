import jwt from "jsonwebtoken";
import axios from "axios";
import { NextRequest } from "next/server";
import { cookies } from 'next/headers';
import { getAccessTokenFromRequest } from '@/lib/cookies';

// Helper: Validate Credentials (JWT) token
function validateCredentialsAccessToken(token: string) {
  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
    
    return { valid: true, provider: "credentials", payload };
  } catch {
    return { valid: false, provider: "credentials" };
  }
}

// Helper: Validate Google token
async function validateGoogleAccessToken(token: string) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`
    );
    return { valid: true, provider: "google", payload: response.data };
  } catch {
    return { valid: false, provider: "google" };
  }
}

// Helper: Refresh Credentials token
function refreshCredentialsToken(refreshToken: string) {
  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);
    const tokenData = payload as jwt.JwtPayload;
    
    if (!tokenData || typeof tokenData !== "object" || !tokenData.userId) {
      throw new Error("Invalid refresh token payload");
    }
    
    const newAccessToken = jwt.sign(
      { 
        userId: tokenData.userId,
        email: tokenData.email,
        role: tokenData.role
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" }
    );
    return { accessToken: newAccessToken };
  } catch {
    return null;
  }
}

// Helper: Refresh Google token
async function refreshGoogleToken(refreshToken: string) {
  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });
    return {
      accessToken: response.data.access_token,
      accessTokenExpires: Date.now() + response.data.expires_in * 1000,
      refreshToken: response.data.refresh_token ?? refreshToken,
    };
  } catch {
    return null;
  }
}

// Main function: API route handler
export async function POST(req: NextRequest) {
  
  // Get access token from cookies or headers
  const accessToken = getAccessTokenFromRequest(req);

  // Always get refresh token from HTTP-only cookie
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return Response.json({ error: "No refresh token provided" }, { status: 401 });
  }

  // Try Credentials validation first
  const credResult = validateCredentialsAccessToken(accessToken ?? "");
  
  if (credResult.valid) {
    return Response.json({ provider: "credentials", payload: credResult.payload });
  }

  // Try Google validation
  const googleResult = await validateGoogleAccessToken(accessToken ?? "");
  
  if (googleResult.valid) {
    return Response.json({ provider: "google", payload: googleResult.payload });
  }

  // Try to refresh Credentials token
  const newCredToken = refreshCredentialsToken(refreshToken);
  
  if (newCredToken) {
    // Set new access token in cookie
    (await cookies()).set('accessToken', newCredToken.accessToken, {
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 15 // 15 minutes
    });
    return Response.json({ provider: "credentials", accessToken: newCredToken.accessToken });
  } else {
    console.error('Failed to refresh credentials token');
  }

  // Try to refresh Google token
   const newGoogleToken = await refreshGoogleToken(refreshToken);
  
  if (newGoogleToken) {
    // Set new access token in cookie for Google token as well
    (await cookies()).set('accessToken', newGoogleToken.accessToken, {
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 15 // 15 minutes
    });
    return Response.json({ provider: "google", ...newGoogleToken });
  } else {
    console.error('Failed to refresh Google token');
  }

  // All failed
  return Response.json({ error: "Invalid or expired token and refresh failed" }, { status: 401 });
}