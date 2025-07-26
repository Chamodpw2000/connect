
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import Image from 'next/image';

type DetailedUser = {
  image: string;
  firstName: string;
  lastName: string;
  email: string;
}

async function fetchUserDetails(email: string): Promise<DetailedUser | null> {
  try {
    // Since this is a server component, you can make direct database calls
    // or use fetch with your API route
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/${email}`, {
      cache: 'no-store', // Ensure fresh data
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch user details')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching user details:', error)
    return null
  }
}

const UserDetails = async () => {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return (
      <div className='p-5 text-center w-full flex flex-col items-center justify-center'>
        <p>Please sign in to view your details</p>
      </div>
    )
  }

  const detailedUser = await fetchUserDetails(session.user.email)

  return (
    <div className='p-5 text-center w-full flex flex-col items-center justify-center'>
      {detailedUser ? (
        <div>
          <h2 className='text-2xl font-bold'>Welcome!</h2>
          <Image 
            src={detailedUser.image || '/Images/feed/avatar.png'} 
            alt="User Avatar" 
            width={200} 
            height={200} 
            className="rounded-full mx-auto border-secondary object-cover" 
          />
          <p>{`${detailedUser.firstName} ${detailedUser.lastName}` || 'User'}</p>
          <p className='text-gray-500 text-xs'>{detailedUser.email || 'No email provided'}</p>
        </div>
      ) : (
        <div>
        <h2 className='text-2xl font-bold'>Welcome!</h2>
          <Image 
            src={session.user.image || '/Images/feed/avatar.png'} 
            alt="User Avatar" 
            width={200} 
            height={200} 
            className="rounded-full mx-auto border-secondary object-cover" 
          />
          <p>{session.user.name || 'User'}</p>
          <p className='text-gray-500 text-xs'>{session.user.email}</p>
        </div>
      )}

      <div className='mt-5'>
        <button className='px-4 py-2 bg-blue-500 text-white rounded'>Edit Profile</button>
      </div>


      <div className="w-full bg-red-100">


      </div>
    </div>
  )
}

export default UserDetails
