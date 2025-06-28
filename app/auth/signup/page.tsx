'use client'

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
// import RegisterForm from './_comps/RegisterForm'
import Link from 'next/link'
import Image from 'next/image'
import RegisterForm from '@/components/auth/registerForm'
export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col md:flex-row justify-center items-center p-4 md:p-8">
      <div className="flex flex-col items-center md:items-start mb-8 md:mb-0 md:mr-16 max-w-md">
        <Image src="/logo.png" alt="Logo" className="w-30 h-30" width={100} height={100} />
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">Connect with People</h2>
        <p className="text-gray-600 text-center md:text-left text-lg">
          Join our growing community today and start connecting with friends, family, and colleagues.
        </p>
      </div>

      <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl text-center text-gray-800">Create Your Account</CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-0">
          <div className="text-center w-full text-sm text-gray-500">
            <span>Already have an account? </span>
            <Link href="/auth/login" className="text-blue-600 font-medium hover:underline">
              Sign in
            </Link>
          </div>
          <div className="text-xs text-center text-gray-500">
            By signing up, you agree to CWP&apos;s Terms of Service and Privacy Policy.
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
