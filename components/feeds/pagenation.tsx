'use client'
import React, { useEffect, useState } from 'react'
import CustomButton from '../common/button'
import { IPost } from '@/types/posts';
import { getPosts } from '@/actions/post.actions';
import { useSession } from 'next-auth/react';


const Paginantion = ({ setPosts, email }: { setPosts: React.Dispatch<React.SetStateAction<IPost[]>>, email?: string }) => {
  const { data: session, status } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [allPages, setAllPages] = useState(1);


  useEffect(() => {
    const fetchPosts = async () => {
      if (status === 'authenticated' && session) {
        console.log('Fetching posts for page:', currentPage, 'Email:', email);
        

        const response = await getPosts(currentPage,email ||undefined);
        setPosts(response.posts);
        setAllPages(response.totalPages);
      }
    }
    fetchPosts();
  }, [status, session, currentPage]);

  // Scroll to top after posts are loaded on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

  return (
    <div className='w-full flex justify-between mt-[20px]'>
      <CustomButton
        label="Previous Page"
        onClick={() => {
          // Logic to load more posts
          setCurrentPage((prev) => (prev - 1));

        }}
        disabled={currentPage === 1}

      />
      <CustomButton
        label="Next Page "
        onClick={() => {
          console.log('Current Page:', currentPage);
          console.log('All Pages:', allPages);
          // Logic to load more posts
          setCurrentPage((prev) => (prev + 1));
        }}
        disabled={currentPage === allPages}
      />
    </div>
  )
}

export default Paginantion