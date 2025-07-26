// import axios from "axios";
// // export async function POST(req: NextRequest) {
// export async function POST(token: any) {
//   try {
//     const response = await axios.post('https://oauth2.googleapis.com/token', {
//       client_id: process.env.GOOGLE_CLIENT_ID,
//       client_secret: process.env.GOOGLE_CLIENT_SECRET,
//       grant_type: 'refresh_token',
//       refresh_token: token.refreshToken,
//     });
//     return {
//       ...token,
//       accessToken: response.data.access_token,
//       accessTokenExpires: Date.now() + response.data.expires_in * 1000,
//       refreshToken: response.data.refresh_token ?? token.refreshToken,
//     };
//   } catch (error) {
//     return { ...token, error: "RefreshAccessTokenError" };
//   }

// }