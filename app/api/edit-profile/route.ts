import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import User from "@/models/user";

export async function POST(request:Request) {

    const session = await getServerSession(authOptions)
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const data = await request.json();

 await dbConnect();

 const user = await User.findOneAndUpdate(
    { email: session.user.email },
    { $set: data },
    { new: true }
 );

    console.log("User profile updated:", user);
   return NextResponse.json({ user });
    
}