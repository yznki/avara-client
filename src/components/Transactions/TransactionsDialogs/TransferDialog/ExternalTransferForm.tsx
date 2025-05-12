'use client';

import { useEffect, useState } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { useUserContext } from '@/context/UserContext';
import type { UserResponse } from '@/types/user';
import { useAuth0 } from '@auth0/auth0-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { api } from '@/lib/api';
import AccountSelect from '@/components/Forms/AccountSelect';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface ExternalTransferFormProps {
  onSuccess: () => void;
}

export default function ExternalTransferForm({ onSuccess }: ExternalTransferFormProps) {
  const { accounts, user } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);

  const externalTransferSchema = z
    .object({
      to: z
        .string({ required_error: 'Please select a user' })
        .refine((to) => to !== user._id, { message: 'You cannot transfer to yourself' }),
      from: z.string({ required_error: 'Please select a source account' }),
      amount: z.coerce.number({ required_error: 'Please enter an amount' }).positive(),
      note: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      const fromAccount = accounts.find((a) => a._id === data.from);
      if (!fromAccount) {
        ctx.addIssue({
          code: 'custom',
          path: ['from'],
          message: 'Source account not found.',
        });
      } else if (data.amount > fromAccount.balance * rate) {
        ctx.addIssue({
          code: 'custom',
          path: ['amount'],
          message: `Insufficient balance. Max: ${(fromAccount.balance * rate).toFixed(2)} ${currency}`,
        });
      }
    });

  const { currency, rate } = useCurrency();
  const { getAccessTokenSilently } = useAuth0();

  const [users, setUsers] = useState<UserResponse[]>([]);

  const form = useForm<z.infer<typeof externalTransferSchema>>({
    resolver: zodResolver(externalTransferSchema),
    defaultValues: { amount: 0 },
  });

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await api.get('/user/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.filter((existingUser: UserResponse) => existingUser._id !== user._id));
      } catch (err) {
        toast.error('Failed to load users');
        console.error(err);
      }
    })();
  }, []);

  async function onSubmit(values: z.infer<typeof externalTransferSchema>) {
    setIsLoading(true);

    const payload = {
      fromId: values.from,
      toUserId: values.to,
      amount: values.amount / rate,
      note: values.note,
    };

    try {
      const token = await getAccessTokenSilently();
      await api.post('/transactions/external-transfer', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Transfer sent successfully');
      onSuccess();
      form.reset();
    } catch (err: any) {
      const code = err?.response?.status;
      if (code === 400) toast.error('Invalid input');
      else if (code === 403) toast.error('Unauthorized or account not found');
      else if (code === 500) toast.error('Transfer failed');
      else toast.error('Unexpected error');
    } finally {
      setIsLoading(false);
    }
  }

  function onCancel() {
    form.reset();
    onSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="from"
            render={({ field }) => (
              <AccountSelect label="From" userAccounts={accounts} field={field} />
            )}
          />
          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>To</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <span>{currency}</span>
                  <Input {...field} type="number" placeholder="Enter amount" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Optional note for this transfer..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full grid grid-cols-2 gap-2">
          <Button variant="ghost" type="reset" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            Transfer
          </Button>
        </div>
      </form>
    </Form>
  );
}
