'use client'
import React from 'react'
import { Button } from '../ui/button'
import Image from "next/image"
import { useRouter } from 'next/navigation'

interface featureCardProps {
  item: {
    title: string,
    text: string,
    link: string,
    image: string
  }
}

const FeatureCard = ({ item }: featureCardProps) => {
  const router = useRouter();

  return (
    <div>
      <div className="bg-accent  p-6 rounded-lg shadow-md lg:max-w-[350px] lg:w-full  text-center group transform transition-transform duration-300 hover:scale-105">
        <div className="overflow-hidden">
          <Image
            src={item.image}
            alt="Create Posts"
            className="mx-auto mb-2 transition-transform duration-300 group-hover:scale-110"
            width={275}

            height={275}
          />
        </div>
        <h4 className="text-xl font-bold mb-2">{item.title}</h4>
        <p className="text-gray-600 text-2xl">{item.text}</p>
        <Button className='bg-accent border-2 text-secondary hover:bg-secondary hover:text-white cursor-pointer  border-secondary w-[200px] my-[20px] rounded-sm' onClick={() => { router.push(`${item.link}`) }}>
          Get Started



        </Button>
      </div>

    </div>
  )
}

export default FeatureCard