'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar } from '@radix-ui/react-avatar';
import { signOut, useSession } from 'next-auth/react';
import { clearAuthCookies } from '@/lib/clientCookies';
import { clientApi } from '@/lib/clientApi';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaCog, FaSearch, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { logOut } from '@/actions/auth.actions';

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [detailedUser, setDetailedUser] = useState<any>(null);
  const router = useRouter();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (status === 'authenticated' && session?.user) {
        try {
          const response = await clientApi.get(`/user/${session.user.email}`);
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

  

  const ProfileDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          <Avatar className="h-10 w-10 rounded-full border-2 border-gray-300 hover:border-blue-500 transition-colors duration-200 flex items-center justify-center overflow-hidden">
            {detailedUser?.image ? (
              <Image
                width={40}
                height={40}
                src={detailedUser.image}
                alt="Profile"
                className="rounded-full object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm rounded-full">
                {detailedUser?.firstName?.charAt(0).toUpperCase() + detailedUser?.lastName?.charAt(0).toUpperCase() || 'NA'}
              </div>
            )}
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-lg rounded-lg p-2" align="end">
        <DropdownMenuLabel className="px-2 py-1.5">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-gray-900">
              {detailedUser?.firstName} {detailedUser?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {detailedUser?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1 border-gray-200" />
        <DropdownMenuItem 
          className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
          onClick={() => router.push(`/feed/${detailedUser?.email}`)}
        >
          <FaUser className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
          onClick={() => router.push('/settings')}
        >
          <FaCog className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1 border-gray-200" />
        <DropdownMenuItem 
          className="flex items-center px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
          onClick={() => {
            logOut();
            setIsMobileMenuOpen(false);
          }}
        >
          <FaSignOutAlt className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <nav className="bg-white text-2xl text-secondary shadow-lg border-b border-gray-200 fixed w-full z-50">
      <div className="xl:px-[5%] px-4 mx-auto">
        {/* Desktop Header */}
        <div className="hidden lg:flex justify-between items-center h-20">
          <div className="flex items-center space-x-4 w-[650px]">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              className="w-12 h-12 cursor-pointer hover:scale-105 transition-transform duration-200" 
              width={48} 
              height={48} 
              onClick={() => router.push('/')} 
            />
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CONNECT
            </span>
            <div className='flex items-center px-4 text-gray-500 border border-gray-300 w-full rounded-full gap-x-3 py-2 hover:border-blue-400 focus-within:border-blue-500 transition-colors duration-200'>
              <FaSearch className="text-gray-400" />
              <input
                placeholder='Search Friends...'
                className='outline-none focus:outline-none w-full text-base placeholder-gray-400'
              />
            </div>
          </div>
          
          <div className="space-x-6 text-base font-medium flex items-center">
            <a href="#home" className="hover:text-blue-600 transition-colors duration-200 py-2">
              Home
            </a>
            <a href="#features" className="hover:text-blue-600 transition-colors duration-200 py-2">
              Features
            </a>
            <a href="#about-us" className="hover:text-blue-600 transition-colors duration-200 py-2">
              About us
            </a>
            <a href="#reviews" className="hover:text-blue-600 transition-colors duration-200 py-2">
              Reviews
            </a>
            
            {!session ? (
              <div className="flex space-x-3">
                <Link
                  href="/auth/login"
                  className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-sm font-medium">
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
                  Sign up
                </Link>
              </div>
            ) : (
              session.user && detailedUser && <ProfileDropdown />
            )}
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              className="w-8 h-8 cursor-pointer" 
              width={32} 
              height={32}
              onClick={() => router.push('/')} 
            />
            <span className="text-lg font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CONNECT
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            {session && detailedUser && <ProfileDropdown />}
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-200 bg-white">
            {/* Mobile Search */}
            <div className="px-4 py-3">
              <div className='flex items-center px-3 text-gray-500 border border-gray-300 w-full rounded-full gap-x-3 py-2 focus-within:border-blue-500 transition-colors duration-200'>
                <FaSearch className="text-gray-400 text-sm" />
                <input
                  placeholder='Search Friends...'
                  className='outline-none focus:outline-none w-full text-sm placeholder-gray-400'
                />
              </div>
            </div>
            
            <div className="flex flex-col space-y-1 px-4 text-base font-medium">
              <a
                href="#home"
                className="hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 py-3 px-2 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="#features"
                className="hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 py-3 px-2 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#about-us"
                className="hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 py-3 px-2 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About us
              </a>
              <a
                href="#reviews"
                className="hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 py-3 px-2 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Reviews
              </a>
              
              {!session && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200 mt-4">
                  <Link
                    href="/auth/login"
                    className="bg-white text-blue-600 border border-blue-600 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-center font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Header
