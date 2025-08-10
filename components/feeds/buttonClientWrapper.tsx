'use client'
import { useRouter } from 'next/navigation';
import React from 'react'

const ButtonClientWrapper = () => {

    const router = useRouter();
  return (
      <button onClick={()=>{router.push('/edit-profile')}} className='px-4 py-2 bg-blue-500 text-white rounded cursor-pointer'>Edit Profile</button>
  )
}

export default ButtonClientWrapper