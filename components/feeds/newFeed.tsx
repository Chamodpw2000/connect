'use client'
import { NewFeedProps } from '@/types/posts';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';




const NewFeed = ({ user }: NewFeedProps) => {
    const navigate = useRouter();
 

   
    return (
        <div className='w-full flex flex-col gap-y-5 border-2 border-secondary rounded-lg p-5'>
        <div className='w-full  flex gap-x-5 items-center'>


            <Image

                src={user?.image || '/Images/feed/avatar.png'}
                alt="User Avatar"
                width={80}
                height={80}
                className='rounded-full  border-secondary object-cover'
            />


            <div>
                What is on your mind, {user?.firstName || 'User'}?
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