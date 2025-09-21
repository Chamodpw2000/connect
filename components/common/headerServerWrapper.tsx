import React from 'react'
import Header from './header'
import { UserApiResponseType } from '@/types/user'
import { getCurrentUser } from '@/actions/user.actionns';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const HeaderServerWrapper = async () => {
    console.log('HeaderServerWrapper: Starting...');
    
    const session = await getServerSession(authOptions);
    console.log('HeaderServerWrapper: Session exists:', !!session);
    
    let user: UserApiResponseType | null = null; 
    
    // Only fetch user if session exists and has email
    if (session?.user?.email) {
        console.log('HeaderServerWrapper: Fetching user for email:', session.user.email);
        try {
            user = await getCurrentUser(session.user.email);
            console.log('HeaderServerWrapper: User fetched successfully');
        } catch (error) {
            console.error("HeaderServerWrapper: Error fetching user:", error);
        }
    } else {
        console.log('HeaderServerWrapper: No session or email, skipping user fetch');
    }
    
    console.log('HeaderServerWrapper: Rendering header...');
    return (
        <div>
            <Header user={user} />
        </div>
    )
}

export default HeaderServerWrapper