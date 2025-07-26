'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, User } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FaGoogle } from 'react-icons/fa';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export default function LoginForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (formValues: z.infer<typeof formSchema>) => {
    const result = await signIn('credentials', {
      email: formValues.email,
      password: formValues.password,
      redirect: false,
    });

    console.log('Login result:', result);
    

    if (result?.error) {
      if( result.error === 'userNotFound') {
        form.setError('email', { type: 'manual', message: 'No user found with this email' });
      } else if (result.error === 'InvalidPassword') {
        form.setError('password', { type: 'manual', message: 'Invalid Password for this Email' });
      }

    } else if (result?.ok || result?.status === 200) {
      router.push('/feed'); // Redirect on successful login
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
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
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      {...field}
                      type="password"
                      className="pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter your password"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">
            Sign In
          </Button>
        </form>
      </Form>

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
    </div>
  );
}
