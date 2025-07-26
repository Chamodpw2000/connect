import jwt from "jsonwebtoken";
import axios from "axios";
import { NextRequest } from "next/server";

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
    const userId = typeof payload === "object" && payload !== null && "userId" in payload
      ? (payload as jwt.JwtPayload).userId as string
      : undefined;
    if (!userId) throw new Error("Invalid refresh token payload");
    const newAccessToken = jwt.sign(
      { userId },
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

  
  // Get access token from body or header
  let accessToken = "";


    accessToken =  req.headers.get("authorization")?.replace("Bearer ", "") || "";

     


  // Always get refresh token from HTTP-only cookie
  const refreshToken = req.cookies.get("refreshToken")?.value;


  // Try Credentials validation
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
  if (refreshToken) {
    const newCredToken = refreshCredentialsToken(refreshToken);
    if (newCredToken) {
      return Response.json({ provider: "credentials", accessToken: newCredToken.accessToken });
    }

    // Try to refresh Google token
    const newGoogleToken = await refreshGoogleToken(refreshToken);
    if (newGoogleToken) {
      return Response.json({ provider: "google", ...newGoogleToken });
    }
  }

  // All failed
  return Response.json({ error: "Invalid or expired token and refresh failed" }, { status: 401 });
}