import { Link } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { features } from '@/constants/home'
import FeatureCard from './featureCard'
import { div } from 'framer-motion/client'

const Features = () => {
  return (
    <div className='border-t-2 mt-15   mx-[5%] text-center  border-secondary text-[64px] text-secondary '>

      Features


      <div className='grid lg:grid-cols-3 gap-x-20 gap-y-5 items-center justify-center mt-[50px]'>

     


      {
        features.map((item) => (

          <div key={item.title} className=' flex items-center justify-center'>

            
          <FeatureCard item={item}  />

          </div>
        ))
      }

 </div>
        

    </div>
  )
}

export default Features