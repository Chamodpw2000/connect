import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import dbConnect from '@/lib/mongoose';
import User from '@/models/user';


export async function POST(req: Request) {

    try {

         const data = await req.json();

    

    
  await dbConnect();

  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists !' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await User.create({
    email: data.email, 
    password: hashedPassword,
    firstName: data.firstName,
    lastName: data.lastName,

    birthdate: new Date(data.birthdate), 
    country: data.country,


   });

  return NextResponse.json({ message: 'User created', user }, { status: 201 });
        
    } catch (error) {
        console.error("Error in registration route:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        
    }

   
}
