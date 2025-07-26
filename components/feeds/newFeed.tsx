'use client'
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Button } from '../ui/button';


const NewFeed = () => {
    const navigate = useRouter();
    type DetailedUser = { image?: string;[key: string]: any };
    const [detailedUser, setDetailedUser] = React.useState<DetailedUser | null>(null);
    const { data: session, status } = useSession();

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (status === 'authenticated' && session?.user) {
                try {
                    const response = await axios.get(`/api/user/${session.user.email}`);
                    setDetailedUser(response.data);
           
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            } else {
                setDetailedUser(null);
            }
        };
        fetchUserDetails();
    }, [status]);
    return (
        <div className='w-full flex flex-col gap-y-5 border-2 border-secondary rounded-lg p-5'>
        <div className='w-full  flex gap-x-5 items-center'>


            <Image

                src={detailedUser?.image || '/Images/feed/avatar.png'}
                alt="User Avatar"
                width={80}
                height={80}
                className='rounded-full  border-secondary object-cover'
            />


            <div>
                What is on your mind, {detailedUser?.firstName || 'User'}?
            </div>
        </div>


<div className='w-full border-2 h-[1px]'>

</div>

<Button className='w-[200px] bg-secondary text-white hover:bg-secondary/80 cursor-pointer' onClick={() => navigate.push('/feed/add-a-post')}>
  Add a Post
</Button>
        </div>
    )
}

export default NewFeed