'use client';
import Paginantion from '@/components/feeds/pagenation';
import Posts from '@/components/feeds/posts';
import { IPost } from '@/types/posts';
import { useParams } from 'next/navigation'
import React, { useState } from 'react'

const page = () => {
    const params = useParams();
    const email = params.email ? decodeURIComponent(params.email as string) : '';
   const [posts, setPosts] = useState<IPost[]>([])
  return (
    <div className='w-full mx-auto'>

        <h1 className="text-2xl font-bold mb-6">Welcome to the Feed, {email}</h1>
        <p className="text-gray-600">This is the feed page where you can see all your posts.</p>
       <Posts posts={posts} />
       <Paginantion setPosts={setPosts} email={email} />
    </div>
  )
}

export default page