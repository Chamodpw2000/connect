import { addPost } from '@/actions/post.actions'
import PostForm from '@/components/feeds/postForm'
import React from 'react'

const AddPost = () => {
  return (
    <div>
        <PostForm addPost={addPost}/>

    </div>
  )
}

export default AddPost