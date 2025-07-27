'use client'
import { IoLocationOutline } from "react-icons/io5";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { register } from "@/actions/auth.actions";
import { registrationFormSchema, RegistrationFormType } from "@/lib/validations/auth";
import { signIn } from 'next-auth/react';
import { FaGoogle } from 'react-icons/fa';

export default function RegisterForm() {


    const form = useForm<RegistrationFormType>({
        resolver: zodResolver(registrationFormSchema),
        defaultValues: {
            birthDate: '',
            country: '',
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    const router = useRouter()
    return (
        <div className="space-y-6">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(async (formValues) => {
                        const status = await register({ formValues });

                        if (status === 201) {
                            router.push('/auth/login');
                        }
                    })}
                    className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField

                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">First Name</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                            <Input
                                                {...field}
                                                className="pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                                placeholder="First name"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Last Name</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                            <Input
                                                {...field}
                                                className="pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                                placeholder="Last name"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700">Country</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <IoLocationOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            {...field}
                                            className="pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Enter your country"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700">Email</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            {...field}
                                            type="email"
                                            className="pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="birthDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700">Birth Date</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            {...field}
                                            type="date"
                                            className="pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700">Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            {...field}
                                            type="password"
                                            className="pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Create a password"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700">Confirm Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            {...field}
                                            type="password"
                                            className="pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Confirm your password"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

                    <div className="flex items-center mt-2">
                        <input
                            type="checkbox"
                            id="terms"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                            I agree to the <span className="text-blue-600 hover:underline cursor-pointer">Terms of Service</span> and{' '}
                            <span className="text-blue-600 hover:underline cursor-pointer">Privacy Policy</span>
                        </label>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors mt-4">
                        Create Account
                    </Button>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">Or</span>
                        </div>
                    </div>

                    <div className="flex  justify-center items-center ">
                        <Button variant="outline" className=" hover:bg-gray-50 cursor-pointer" onClick={() => signIn('google')}>
                            <FaGoogle className="mr-2" /> Continue with Google
                        </Button>

                    </div>
                </form>
            </Form>
        </div>
    )
}