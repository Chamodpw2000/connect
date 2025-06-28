'use client'
import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const HomeHero = () => {
    const navigate = useRouter();
    return (
        <div className='flex flex-col ig:flex-row  relative  '>

            <div className='flex flex-col w-full '>



                <div className='xl:text-[64px] text-[45px] text-center lg:text-left xl:px-[10%] 2xl:px-[15%] px-[5%] lg:px-[5%] flex items-center justify-center lg:justify-start pt-[5%] text-secondary font-semibold bg-accent '>

                    "Connect, Share,<br />
                    And Engage Like <br />
                    Never Before.”

                </div>


                <div className='text-secondary text-center lg:text-left 2xl:px-[15%] px-[5%] xl:px-[10%]  lg:px-[5%] md:px-[10%] flex items-center justify-center lg:justify-start'>
                    Create posts, share ideas, and gather <br />opinions through interactive polls.<br /> Experience the future with enhanced AR/MR features <br /> that bring your social interactions to life.<br /> Welcome to your new digital hub!"
                </div>


                <div className='pt-5 font-semibold w-full  text-secondary 2xl:px-[15%] px-[5%] flex flex-col xl:px-[10%]  lg:px-[5%] md:px-[10] items-center justify-center lg:items-start'>
                    Come and join with us


                    <Button className='bg-accent border-2 text-secondary hover:bg-secondary hover:text-white cursor-pointer  border-secondary w-[200px] my-[20px] rounded-xl' onClick={()=> navigate.push('/feed')}>
                        Get Started



                    </Button>

                </div>





            </div>







            <Image
                src="/Images/home/homehero.webp"
                alt="Hero"
                width={500}
                height={500}
                className='lg:absolute xl:right-1/6 top-1/6 xl:scale-110 lg:right-0 mx-auto '
            />



        </div>
    )
}

export default HomeHero