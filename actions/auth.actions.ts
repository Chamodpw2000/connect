'use server'
import { AUTH_ENDPOINTS } from "@/constants/api-endpoints.constants"
import { loginFormSchema, LoginFormType, registrationFormSchema, RegistrationFormType } from "@/lib/validations/auth"
import { validateInput } from "@/lib/validations/inputValidator"
import axios, { AxiosError } from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import { cookies } from "next/headers"




export const register = async ({ data }: { data: RegistrationFormType }) => {
    const validatedData = validateInput(registrationFormSchema, data);
    const payload = {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        password: validatedData.password,
        birthdate: validatedData.birthDate,
        country: validatedData.country,
    }
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${AUTH_ENDPOINTS.REGISTER}`, payload)
    return response.data;
}

export const login = async (data: LoginFormType) => {
    const validatedData = validateInput(loginFormSchema, data);
    console.log('Login function called with data:', validatedData);
    
    
    try {
        // Make a direct API call to your login endpoint
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${AUTH_ENDPOINTS.LOGIN}`, {
            email: validatedData.email,
            password: validatedData.password,
        });


        
        

        // If login successful, revalidate and redirect
        if (response.status === 200) {
          console.log('Login successful, revalidating and redirecting...');
          try {
            console.log('Revalidating path...');
            await revalidatePath('/feed?page=1');
          
       
          } catch (error) {
            console.error('Error during revalidation or redirection:', error);
            
          }
          
          
        }
        console.log('Login function completed successfully');
        
        
        return { success: true };
    } catch (error) {
   
        
        console.error('Login error:', error);
        return { 
            success: false, 
            error: error instanceof AxiosError ? error.response?.data?.error : 'Login failed' 
        };
    }
};

export const logOut = async () => {
    try {
        // Clear server-side cookies
        const cookieStore = await cookies();
        cookieStore.delete('accessToken');
        cookieStore.delete('refreshToken');
        cookieStore.delete('next-auth.session-token');
        cookieStore.delete('next-auth.csrf-token');
        cookieStore.delete('next-auth.callback-url');
        
        // // Call logout API to clear any additional server-side state
        // await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/logout`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        // });
        
        return { success: true };
    } catch (error) {
        console.error('Logout API error:', error);
        return { success: false, error: 'Logout failed' };
    }
};

