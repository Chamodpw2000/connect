import axios from 'axios'
import React, { useEffect, useState } from 'react'
import PostCard from './postCard'
import { useSession } from 'next-auth/react';
import api from '@/lib/interceptors';



interface IAuthor {
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  role: string;
}
interface IPost {
  _id: string;
  title: string;
  content: string;
  author: IAuthor;
  createdAt: string | Date;
  updatedAt: string | Date;
  images?: string[];
}

const Posts = () => {
  const { data: session, status } = useSession();


  const [posts, setPosts] = useState<IPost[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
  
    const fetchPosts = async () => {
      try {
   

        localStorage.setItem('accessToken', session?.user?.accessToken || '');
 

        const response = await api.get('/posts')

        
        setPosts(response.data)
   


      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

      if (status === 'authenticated' && session) {
          fetchPosts()
       }
  
  }, [status, session])

  return (
    <div>
      {loading ? (
        <p>Loading posts...</p>
      ) : (
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

        ))
      )}
    </div>
  )
}

export default Posts