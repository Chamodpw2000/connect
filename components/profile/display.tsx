'use client'
import { useAuth } from '@/hooks/useUser'
import Image from 'next/image'

const DisplayProfile = () => {
      const { user } = useAuth();
  return (
     <div className="flex  w-full flex-col items-center justify-start">
           

                        <Image
                            src={user?.image || '/Images/feed/avatar.png'}
                            alt={user?.firstName || 'User Avatar'}
                            width={300}
                            height={300}
                            className="rounded-full w-[300px] h-[300px] object-cover mb-4 "
                        />

                        <div>

                       

                        <h1 className="text-xl font-bold "><span className='text-gray-600'>First Name:</span> {user?.firstName}</h1>
                        <h1 className="text-xl font-bold"><span className='text-gray-600'>Last Name:</span> {user?.lastName}</h1>

                        <p className="text-gray-600 "><span className='text-gray-600'>Email:</span> {user?.email}</p>
                        <p className="text-gray-600"><span className='text-gray-600'>Role:</span> {user?.role || 'User'}</p>
                        <p className="text-gray-600"><span className='text-gray-600'>Joined:</span> {new Date(user?.createdAt || '').toLocaleDateString()}</p>
                                                <p className="text-gray-600"><span className='text-gray-600'>Role:</span> {user?.role || 'User'}</p>
                        <p className="text-gray-600"><span className='text-gray-600'>Country:</span> {user?.country || 'Unknown'}</p>
                        <p className="text-gray-600"><span className='text-gray-600'>Bio:</span> {user?.bio || 'No bio available'}</p>


 </div>

                </div>

  )
}

export default DisplayProfile