
import dbConnect from '@/lib/mongoose';
import Post from '@/models/post';
import { NextResponse } from 'next/server';


export async function GET() {
  await dbConnect();
  const posts = await Post.find({});
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const { title, content } = await request.json();
  await dbConnect();
  const newPost = await Post.create({ title, content });
  return NextResponse.json(newPost);
}
