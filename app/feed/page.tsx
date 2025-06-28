'use client'
import NewFeed from '@/components/feeds/newFeed'
import Posts from '@/components/feeds/posts'
import React from 'react'

const page = () => {
  return (
    <div className='w-full'>

        <NewFeed/>
        <Posts/>
    </div>
  )
}

export default page