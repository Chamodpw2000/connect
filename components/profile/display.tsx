'use client'
import { useAuth } from '@/hooks/useUser'
import { UserApiResponseType } from '@/types/user'
import Image from 'next/image'

interface DisplayProfileProps {
  user?: UserApiResponseType;
}

const DisplayProfile = ({ user }: DisplayProfileProps) => {
    
      
      // Use server-side user if available, otherwise fall back to hook user


      
  return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg flex flex-col items-center">
            <div className="relative group mb-6">
                <Image
                    src={user?.image || '/Images/feed/avatar.png'}
                    alt={user?.firstName || 'User Avatar'}
                    width={180}
                    height={180}
                    className="rounded-full w-[180px] h-[180px] object-cover border-4 border-blue-200 shadow-lg"
                />
                {/* Decorative ring */}
                <div className="absolute inset-0 rounded-full border-4 border-blue-400 opacity-30 pointer-events-none"></div>
            </div>
            <div className="w-full text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">{user?.firstName} {user?.lastName}</h1>
                <p className="text-blue-600 font-medium mb-4">{user?.role || 'User'}</p>
                        <div className="flex flex-col gap-4 mb-6 w-full">
                            <div className="bg-gray-50 rounded-lg p-4 shadow w-full">
                                            <div className="flex flex-col gap-4 w-full">
                                                <div className="w-full">
                                                    <span className="block text-xs text-gray-500 mb-1">Email</span>
                                                    <span className="block text-base text-gray-700 font-semibold">{user?.email}</span>
                                                </div>
                                                <div className="w-full">
                                                    <span className="block text-xs text-gray-500 mb-1">Country</span>
                                                    <span className="block text-base text-gray-700 font-semibold">{user?.country || 'Unknown'}</span>
                                                </div>
                                                <div className="w-full">
                                                    {/* <span className="block text-xs text-gray-500 mb-1">Joined</span>
                                                    <span className="block text-base text-gray-700 font-semibold">{new Date(user?.createdAt || '').toLocaleDateString()}</span> */}
                                                </div>
                                            </div>
                            </div>
                        </div>
                <div className="bg-gray-100 rounded-lg p-6 shadow text-left mb-4">
                    <span className="block text-xs text-gray-500 mb-2">Mini Description</span>
                    <p className="text-gray-700 text-base">{user?.miniDescription || 'No mini description available'}</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-6 shadow text-left">
                    <span className="block text-xs text-gray-500 mb-2">Bio</span>
                    <p className="text-gray-700 text-base">{user?.bio || 'No bio available'}</p>
                </div>
            </div>
        </div>

  )
}

export default DisplayProfile