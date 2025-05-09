'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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

const emailSchema = z.object({
  email: z.string().email('Enter a valid email'),
});

type EmailSchema = z.infer<typeof emailSchema>;

interface EnterEmailFormProps {
  onNext: (email: string) => void;
}

export default function EnterEmailForm({ onNext }: EnterEmailFormProps) {
  const form = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (values: EmailSchema) => {
    console.log('Reset request for:', values.email);
    // TODO: trigger backend reset email
    onNext(values.email);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Reset Your Password</h2>
        <p className="text-sm text-muted-foreground">Enter your email to receive a reset code.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="example@avara.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Send Code
          </Button>
        </form>
      </Form>
    </div>
  );
}
