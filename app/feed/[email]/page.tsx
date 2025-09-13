import { getPosts } from '@/actions/post.actions'
import NewFeed from '@/components/feeds/newFeed'
import Paginantion from '@/components/feeds/pagenation'
import Posts from '@/components/feeds/posts'
import { PostApiResponseType, PostForPostCardType } from '@/types/posts'

import { useSearchParams } from 'next/navigation'


const page = async () => {
    const searchParams = useSearchParams()
    const pageParam = searchParams.get('page')
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
      const response = await getPosts({ page: pageParam ? parseInt(pageParam, 10) : 1, itemsPerPage: 5 });
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