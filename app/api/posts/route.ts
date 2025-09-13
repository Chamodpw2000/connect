import dbConnect from '@/lib/mongoose';
import { Post, Comment, User } from '@/models';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import mongoose from 'mongoose';

type DetailedUser = {
  image: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}




// Helper to generate tags from title, content, and author
function generateTags(title: string, content: string, authorName: string): string[] {
  const stopWords = new Set([
    'the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'to', 'in', 'for', 'of', 'with', 'by', 'as', 'it', 'this', 'that', 'from', 'or', 'be', 'are', 'was', 'were', 'has', 'have', 'had', 'but', 'not', 'can', 'will', 'would', 'should', 'could', 'you', 'your', 'i', 'we', 'they', 'he', 'she', 'his', 'her', 'their', 'our', 'us', 'them', 'so', 'if', 'then', 'than', 'about', 'just', 'into', 'out', 'up', 'down', 'over', 'under', 'again', 'more', 'most', 'some', 'such', 'no', 'nor', 'too', 'very', 's', 't', 'd', 'll', 'm', 'o', 're', 've', 'y'
  ]);
  const text = `${title} ${content} ${authorName}`.toLowerCase();
  const words = text.match(/\b\w{3,}\b/g) || [];
  const tags = Array.from(new Set(words.filter(word => !stopWords.has(word))));
  return tags.slice(0, 10); // Limit to 10 tags
}


export async function GET(request: Request) {


  
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const pageParam = searchParams.get('page');
  const itemsPerPageParam = searchParams.get('itemsPerPage');
  const sortByParam = searchParams.get('sortBy');
  const sortOrderParam = searchParams.get('sortOrder');
  const emailParam = searchParams.get('email');
  const email = emailParam || undefined;
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const postsPerPage = itemsPerPageParam ? parseInt(itemsPerPageParam, 10) : 5;
  const sortBy = sortByParam || 'createdAt';
  const sortOrder = sortOrderParam === 'asc' ? 1 : -1;

  await dbConnect();

  try {
    const filter: any = {};
    if (email) {
      filter['author.email'] = email;
    }
    const allPostsCount = await Post.countDocuments(filter);
    console.log(allPostsCount);
    
    if (allPostsCount === 0) {
      return NextResponse.json({ message: 'No posts found for this email' }, { status: 200 });
    }
    const totalPages = Math.ceil(allPostsCount / postsPerPage);
    console.log(totalPages);
    
    let posts = await Post.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * postsPerPage)
      .limit(postsPerPage)
      .populate('author')
      .populate('comments')
      .populate('likes');

      console.log(
        posts
      );
      
    


    console.log(posts);
    
    
    return NextResponse.json({ posts, totalPages }, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}




export async function POST(request: Request) {





  try {

    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    console.log('Received post data:', data);




 await dbConnect();
    const title = data.title;
    const content = data.description || '';
    const userId  = data.userId;
    const visibility = data.visibility || 'public';
    let authorName = '';
    const detailedUser = await User.findOne({ email: session.user.email }) as unknown as DetailedUser;
    if (detailedUser) {
      authorName = `${detailedUser.firstName || ''} ${detailedUser.lastName || ''}`;
    }
    const tags = generateTags(title, content, authorName);





   
    const newPost = await Post.create({
      title,
      content,
      author: new mongoose.Types.ObjectId(String(userId)),
      images: data.images || [],
      tags,
      visibility
    });
    return NextResponse.json(newPost, { status: 200 });
  } catch (e) {
    console.error('Error creating post:', e);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }

}
