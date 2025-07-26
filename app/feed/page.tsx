'use client'
import NewFeed from '@/components/feeds/newFeed'
import Paginantion from '@/components/feeds/pagenation'
import Posts from '@/components/feeds/posts'
import { IPost } from '@/types/posts'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

const page = () => {

  ``
  
  
    const [posts, setPosts] = useState<IPost[]>([])


    
  return (
    <div className='w-full'>

        <NewFeed/>
        <Posts posts={posts} />
        <Paginantion setPosts={setPosts} />
    </div>
  )
}

export default page