// import { NextRequest, NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';

// export async function POST(req: NextRequest) {

  
//   const { refreshToken } = await req.json();

//   try {
//     const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);
//     // ...check DB if needed...

//     let userId: string | undefined;
//     if (typeof payload === 'object' && payload !== null && 'id' in payload) {
//       userId = (payload as jwt.JwtPayload).id as string;
//     }

//     if (!userId) {
//       return NextResponse.json({ error: 'Invalid refresh token payload' }, { status: 401 });
//     }

//     const newAccessToken = jwt.sign(
//       { userId },
//       process.env.ACCESS_TOKEN_SECRET as string,
//       { expiresIn: '15m' }
//     );

//     return NextResponse.json({ accessToken: newAccessToken });
//   } catch (error) {
//     return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
//   }
// }