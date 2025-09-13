import { getPosts } from '@/actions/post.actions'
import NewFeed from '@/components/feeds/newFeed'
import Paginantion from '@/components/feeds/pagenation'
import Posts from '@/components/feeds/posts'
import { PostApiResponseType, PostForPostCardType } from '@/types/posts'

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

const page = async ({ searchParams }: PageProps) => {
    const pageParam = searchParams.page
    let posts: PostApiResponseType[] = [];

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
      });
      posts = response?.posts || [];
    } catch (error) {
      console.error('Error fetching posts:', error);
      
    }
        
    return (
      <div className='w-full'>

          <NewFeed/>
          <Posts posts={posts.map(toPostForPostCardType)} />
          <Paginantion allPages={5}  />
      </div>
    )
}

export default page