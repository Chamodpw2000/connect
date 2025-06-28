
import dbConnect from '@/lib/mongoose';
import Post from '@/models/post';
import { image } from 'framer-motion/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
type DetailedUser = {
  image: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}


async function fetchUserDetails(email: string): Promise<DetailedUser | null> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/${email}`, {
      cache: 'no-store', // Ensure fresh data
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user details');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
}
export async function GET() {
  await dbConnect();
  const posts = await Post.find({});
  return NextResponse.json(posts);
}




export async function POST(request: Request) {


  try{

    const session = await getServerSession(authOptions)
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const detailedUser = await fetchUserDetails(session.user.email)

  const data = await request.json();




  const title = data.title;

  const content = data.description || '';

  const email = session.user.email;
  const firstName = detailedUser?.firstName || '';
  const lastName = detailedUser?.lastName || '';
  const image = detailedUser?.image || '/Images/feed/avatar.png';

  const role = detailedUser?.role || 'user';


  await dbConnect();
  const newPost = await Post.create({
    title,
    content,
    author: {
      email,
      firstName,
      lastName,
      image,
      role,
    },
images: data.images || [],
  });
  return NextResponse.json(newPost, { status: 200 });
  }catch(e){
    console.error('Error creating post:', e);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }

  // await dbConnect();
  // const newPost = await Post.create({ title, content });
  // return NextResponse.json(newPost);
}
