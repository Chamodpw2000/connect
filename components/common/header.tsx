'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
// import ProfileMenu from './ProfileMenu'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const router = useRouter();

  return (
    <nav className="bg-white text-blue-500 shadow-2xl border-b-2 border-gray-300 rounded-b-2xl fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Header */}
        <div className="hidden lg:flex justify-between items-center h-24">
          <div className="flex items-center space-x-4">
            <Image src="/logo.png" alt="Logo" className="w-30 h-30 cursor-pointer" width={100} height={100} onClick={() => router.push('/')} />
            <span className="text-3xl font-extrabold">CONNECT</span>
          </div>
          <div className="space-x-8 text-lg font-semibold">
            <a href="#home" className="hover:text-blue-700 transition-colors duration-200">
              Home
            </a>
            <a href="#features" className="hover:text-blue-700 transition-colors duration-200">
              Features
            </a>
            <a href="#about-us" className="hover:text-blue-700 transition-colors duration-200">
              About us
            </a>
            <a href="#reviews" className="hover:text-blue-700 transition-colors duration-200">
              Reviews
            </a>
            <Link
              href="/auth/login"
              className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200">
              Log in
            </Link>
               <Link
              href="/auth/signup"
              className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200">
             Sign up
            </Link>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Logo" className="w-8 h-8" width={32} height={32} />
            <span className="text-xl font-extrabold">CONNECT</span>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4">
            <div className="flex flex-col space-y-4 text-base font-semibold">
              <a 
                href="#home" 
                className="hover:text-blue-700 transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </a>
              <a 
                href="#features" 
                className="hover:text-blue-700 transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#about-us" 
                className="hover:text-blue-700 transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About us
              </a>
              <a 
                href="#reviews" 
                className="hover:text-blue-700 transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Reviews
              </a>
              <Link
                href="/auth/login"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-center w-fit"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Log in
              </Link>


              <Link
                href="/auth/signup"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-center w-fit"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Header
