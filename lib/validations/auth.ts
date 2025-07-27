import z from "zod";

export const registrationFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  country: z.string().min(1, 'Country is required'),

  birthDate: z.string().refine((value) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) return false;

    const today = new Date();
    const minAgeDate = new Date(
      today.getFullYear() - 16,
      today.getMonth(),
      today.getDate()
    );

    return date <= minAgeDate;
  }, {
    message: 'You must be at least 16 years old',
  }),

  password: z.string().min(5, {
    message: 'Password must be at least 5 characters long',
  }),

  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type RegistrationFormType = z.infer<typeof registrationFormSchema>;

export const loginFormSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export type LoginFormType = z.infer<typeof loginFormSchema>;

