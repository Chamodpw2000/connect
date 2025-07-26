import { IPost, PostsProps } from '@/types/posts';
import { useSession } from 'next-auth/react';
import React from 'react';
import PostCard from './postCard';

const Posts: React.FC<PostsProps> = ({ posts }) => {
  const { data: session, status } = useSession();

  return (
    <div>
      {
        posts.map(post => (
          <PostCard
            key={post._id}
            post={post}
            onLike={() => console.log('Liked post:', post)}
            onComment={() => console.log('Commented on post:', post)}
            onShare={() => console.log('Shared post:', post)}
            onEdit={() => console.log('Edited post:', post)}
            onDelete={() => console.log('Deleted post:', post)}
            currentUserEmail={session?.user?.email || ''}
            className="my-4"

          />

      ))}
    </div>
  )
}

export default Posts;