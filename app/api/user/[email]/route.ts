import dbConnect from '@/lib/mongoose';
import User from '@/models/user';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: { email: string } }
) {
  // Await params before using
  const { email } = await context.params;
  console.log('Fetching user with email:', email);
      
  if (!email) {
    return NextResponse.json(
      { message: 'Email is required' },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
            
    // Find user by email - decode URI component for emails with special characters
    const user = await User.findOne(
      { email: decodeURIComponent(email) }
      // Note: Remove projection for Mongoose, use select instead if needed
    ).select('-password'); // Exclude password from response

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
