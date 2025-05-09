'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
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
import { loginSchema, type LoginSchema } from './authSchema';
import OAuthButton from './OAuthButton';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: LoginSchema) => {
    console.log('Login Data:', values);
    // TODO: call login API
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="example@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Password</FormLabel>
                <Link to="/reset-password" className="text-sm text-primary underline">
                  Forgot your password?
                </Link>
              </div>
              <FormControl>
                <div className="relative">
                  <Input type={showPassword ? 'text' : 'password'} {...field} />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Login
        </Button>

        <div className="space-y-2 mt-4">
          <div className="relative text-center text-sm text-muted-foreground">
            <span className="bg-background px-4 relative z-10">or continue with</span>
            <div className="absolute top-1/2 w-full border-t left-0 -z-0"></div>
          </div>
          <OAuthButton provider="google" onClick={() => console.log('Google login')} />
          <OAuthButton provider="github" onClick={() => console.log('GitHub login')} />
        </div>
      </form>
    </Form>
  );
}
