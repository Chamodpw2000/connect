import { loginFormSchema, LoginFormType, registrationFormSchema, RegistrationFormType } from "@/lib/validations/auth"
import { validateInput } from "@/lib/validations/inputValidator"
import axios, { AxiosError } from "axios"
import { signIn } from "next-auth/react"




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
    const response = await axios.post('/api/auth/register', payload)
    return response.data;
}

export const login = async (data: LoginFormType) => {
    const validatedData = validateInput(loginFormSchema, data);
    const result = await signIn('credentials', {
        email: validatedData.email,
        password: validatedData.password,
        redirect: false,
    });

    return result;

};

