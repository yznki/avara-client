import { z } from 'zod';

export const signUpSchema = z
  .object({
    name: z.string().min(1, 'Full name is required'),
    email: z.string().email('Enter a valid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'At least one uppercase letter required')
      .regex(/[a-z]/, 'At least one lowercase letter required')
      .regex(/[0-9]/, 'At least one number required')
      .regex(/[^A-Za-z0-9]/, 'At least one special character required'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords don't match",
  });

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password is required'),
});

export type LoginSchema = z.infer<typeof loginSchema>;
