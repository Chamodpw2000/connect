import dbConnect from "@/lib/mongoose";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function PUT(request:Request,
     context: { params: { id: string } }

) {
     const { id } = await context.params;


console.log("id from context params:", id);


  
  const data = await request.json();

 await dbConnect();

 const user = await User.findOneAndUpdate(
    { _id: id },
    { $set: data },
    { new: true }
 );

    console.log("User profile updated:", user);
   return NextResponse.json({ user });
    
}