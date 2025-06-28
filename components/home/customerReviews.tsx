import { Link } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { features } from '@/constants/home'
import FeatureCard from './featureCard'
import { div } from 'framer-motion/client'

const CustomerReviews = () => {
  return (
    <div className='border-t-2 mt-15   mx-[5%] text-center  border-secondary text-[64px] text-secondary '>

      Customer Reviews



     


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-[60px] ">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 gap-x-[10%]">
            {[
              {
                name: 'Sarah M. (Content Creator)',
                img: '/Images/home/reviewer-1.webp',
                stars: 5,
                review: "I absolutely love this platform! It's so easy to create and share posts.",
              },
              {
                name: 'Daniel K. (Community Enthusiast)',
                img: '/Images/home/reviewer-2.webp',
                stars: 4,
                review: 'This website has completely transformed the way I interact online.',
              },
              {
                name: 'Priya R. (Student & Poll Enthusiast)',
                img: '/Images/home/reviewer-3.webp',
                stars: 3,
                review: "I joined to stay updated on my favorite topics, and I've been hooked ever since!",
              },
            ].map(({ name, img, stars, review }, i) => (
              <div
                key={i}
                className="bg-gray-100 text-xl  p-6 rounded-lg shadow-md text-center transition-transform duration-300 hover:scale-105">
                <div className="mb-4">
                  <img src={img} alt={name} className="w-20 h-20 rounded-full mx-auto" />
                </div>
                <div className="mb-4 flex justify-center">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className={j < stars ? 'text-yellow-500' : 'text-gray-300'}>
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700">"{review}"</p>
                <h4 className="mt-4 font-bold">{name}</h4>
              </div>
            ))}
          </div>
        </div>
 </div>
        

  )
}

export default CustomerReviews;