import { getCurrentUser } from '@/actions/user.actionns';
import EditProfileClientWrapper from '@/components/profile/editProfileClientWrapper'
import { UserApiResponseType } from '@/types/user'
import React from 'react'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

const EditProfile = async () => {
  // Get session to fetch current user's email
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
    redirect('/auth/login');
  }

  let user: UserApiResponseType;
  try {
    user = await getCurrentUser(session.user.email);
  } catch (error) {
    console.error('Error fetching user:', error);
    redirect('/auth/login');
  }

  return (
    <div>
      <EditProfileClientWrapper user={user} />
    </div>
  )
}

export default EditProfile


