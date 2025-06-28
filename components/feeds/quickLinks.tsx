'use client'
import Link from 'next/link'
import React from 'react'

const QuickLink = () => {
    return (
        <div className='w-full mt-5 gap-y-5 flex flex-col'>

            <Link
                href="">
                Friends
            </Link>

            <Link
                href="">
                Posts
            </Link>


            <Link
                href="">
                Polls
            </Link>

            <Link
                href="">
                Disscussions
            </Link>


        </div>
    )
}

export default QuickLink