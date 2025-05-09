'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const schema = z
  .object({
    password: z
      .string()
      .min(8, 'At least 8 characters')
      .regex(/[A-Z]/, 'Must include an uppercase letter')
      .regex(/[0-9]/, 'Must include a number')
      .regex(/[^A-Za-z0-9]/, 'Must include a special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type ResetSchema = z.infer<typeof schema>;

interface ResetPasswordFormProps {
  email: string;
}

export default function ResetPasswordForm({ email }: ResetPasswordFormProps) {
  const [show, setShow] = useState(false);
  const toggleShow = () => setShow((prev) => !prev);

  const form = useForm<ResetSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: ResetSchema) => {
    console.log('Reset password for:', email, data.password);
    // TODO: call API to reset password
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Set a New Password</h2>
        <p className="text-sm text-muted-foreground">Create a strong password for your account.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type={show ? 'text' : 'password'} {...field} />
                    <button
                      type="button"
                      onClick={toggleShow}
                      className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
                      tabIndex={-1}
                    >
                      {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type={show ? 'text' : 'password'} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </form>
      </Form>
    </div>
  );
}
