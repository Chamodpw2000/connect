import { getPosts } from '@/actions/post.actions'
import NewFeed from '@/components/feeds/newFeed'
import Paginantion from '@/components/feeds/pagenation'
import Posts from '@/components/feeds/posts'
import { PostApiResponseType, PostForPostCardType } from '@/types/posts'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getCurrentUser } from '@/actions/user.actionns'
import { UserApiResponseType } from '@/types/user'

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}


const Feeds = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const pageParam = params.page;
  let posts: PostApiResponseType[] = [];
  let totalPages = 1;

  // Get session user on the server side
  const session = await getServerSession(authOptions);
  // session.user contains the logged-in user info

  function toPostForPostCardType(post: PostApiResponseType): PostForPostCardType {
    return {
      _id: post._id,
      title: post.title,
      content: post.content,
      author: post.author,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      images: post.images,
    };
  }

  try {
    const response = await getPosts({ 
      page: pageParam ? parseInt(Array.isArray(pageParam) ? pageParam[0] : pageParam, 10) : 1, 
      itemsPerPage: 5 
    }, session?.user?.email || '');
   
    // console.log(response.posts);
    
    posts = response?.posts || [];
    totalPages = response?.totalPages || 1;
  } catch (error) {
    console.error('Error fetching posts:', error);
    
  }

  let user:UserApiResponseType | null = null;

  try {
    user = await getCurrentUser(session?.user?.email || '');
 
    
  } catch (error) {
    console.error('Error fetching user session:', error);
  }


  return (
    <div className='w-full'>

          <NewFeed user={user} />
          <Posts posts={posts.map(toPostForPostCardType)} />
          <Paginantion allPages={totalPages}/>
      </div>
    )
}

export default Feeds;