import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongoose';
import User from '@/models/user';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    
    console.log('Login attempt for email:', email);
    

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }


    

    // Connect to database
    await dbConnect();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

 
    

    // Verify password
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }


    

    // Check if JWT secrets are defined
    if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
      console.error('JWT secrets not defined');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }


    

    // Generate tokens
    const accessToken = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );


    

    const refreshToken = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

     const userData = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      image: user.image,
      bio: user.bio,
      country: user.country,
      miniDescription: user.miniDescription,
    };

    // Set cookies
    const cookieStore = await cookies();


    
    
    // Set access token (accessible by client)
(await cookies()).set('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        // Set access token in cookie (accessible to client-side JavaScript)
        (await cookies()).set('accessToken', accessToken, {
          httpOnly: false, // Allow client-side access
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 15 // 15 minutes
        });

    // console.log('Tokens set in cookies successfully', accessToken, refreshToken );
    
console.log(cookieStore.get('accessToken'));

    // Return user data (without password)


    console.log('User logged in successfully:', userData);
    

      return NextResponse.json({
      message: 'Login successful',
      user: userData,
      accessToken, // Also return in response body if needed
    });


 

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}