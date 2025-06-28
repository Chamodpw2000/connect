import { team } from '@/constants/home';
import React from 'react'

const AboutUs = () => {
  return (
   <div className='border-t-2 mt-15   mx-[5%] text-center  border-secondary text-[64px] text-secondary '>

      About Us

<div className='text-2xl text-gray-700 '>
    we aim to redefine the way people connect and interact online. Our platform empowers users to express themselves creatively, share meaningful moments, and engage with communities that inspire them. Whether you’re posting your thoughts, sharing your latest adventures, or creating polls to spark discussions, we provide the tools to bring your ideas to life.
</div>
      <div className='grid lg:grid-cols-4 gap-x-10 gap-y-5 items-center justify-center mt-[50px]'>

     

{
    team.map((member: { name: string; image: string;  }) => {
        return (
            <div key={member.name} className='flex items-center justify-center '>
            <div className=' p-6 rounded-lg  lg:max-w-[550px] lg:w-full text-center group transform transition-transform duration-300 hover:scale-105'>
                <img src={member.image} alt={member.name} className='mx-auto mb-2 w-40 h-40 rounded-full object-contain' />
                <h4 className='text-xl font-bold mb-2'>{member.name}</h4>
            </div>
            </div>
        )
    })
}

 </div>
        

    </div>
  )
}

export default AboutUs