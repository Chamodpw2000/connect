import React from 'react'
import Header from './header'
import { UserApiResponseType } from '@/types/user'
import { getCurrentUser } from '@/actions/user.actionns';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const HeaderServerWrapper = async () => {
    const session = await getServerSession(authOptions);
    let user : UserApiResponseType | null = null; 
    try {
        user = await getCurrentUser(session?.user?.email || '');
    } catch (error) {
        console.error("Error fetching user:", error);
    }
  return (
    <div>

        <Header user={user} />
    </div>
  )
}

export default HeaderServerWrapper