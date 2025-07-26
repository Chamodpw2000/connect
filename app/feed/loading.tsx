import React from 'react'

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen  bg-accent">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-secondary mb-6"></div>
      <span className="text-secondary text-2xl font-bold">Loading...</span>
    </div>
  )
}

export default Loading;