import { LoginFormType, RegistrationFormType } from "@/lib/validations/auth"
import axios, { AxiosError } from "axios"
import { signIn } from "next-auth/react"


import { toast } from "react-toastify"

export const register = async ({ formValues }: { formValues: RegistrationFormType }) => {
    const payload = {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        password: formValues.password,
        birthdate: formValues.birthDate,
        country: formValues.country,
    }


    try {
        const response = await axios.post('/api/auth/register', payload)
        if (response.status === 201) {
            toast.success('Registration successful !')
            return response.status

        }
    } catch (error) {
        const response = (error as AxiosError).response
        if (response && response.status !== 201) {

            let errorMessage = 'Registration failed. Please try again !'
            if (response.data && typeof response.data === 'object' && 'error' in response.data) {
                errorMessage = (response.data as { error?: string }).error || errorMessage
            }
            toast.error(errorMessage)
            return response.status
        }
    }
}

export const login = async (formValues: LoginFormType) => {
    const result = await signIn('credentials', {
        email: formValues.email,
        password: formValues.password,
        redirect: false,
    });

 return result;

};

