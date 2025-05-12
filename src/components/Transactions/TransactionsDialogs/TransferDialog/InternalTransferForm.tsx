'use client';

import { useMemo, useState } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { useUserContext } from '@/context/UserContext';
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
import { Textarea } from '@/components/ui/textarea';

interface InternalTransferFormProps {
  onSuccess: () => void;
}

export default function InternalTransferForm({ onSuccess }: InternalTransferFormProps) {
  const { accounts } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);

  const internalTransferSchema = z
    .object({
      from: z.string({ required_error: 'Please select a source account' }),
      to: z.string({ required_error: 'Please select a destination account' }),
      amount: z.coerce.number({ required_error: 'Please enter an amount' }).positive(),
      note: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.from === data.to) {
        ctx.addIssue({
          code: 'custom',
          path: ['to'],
          message: 'Cannot transfer to the same account.',
        });
      }

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

  const form = useForm<z.infer<typeof internalTransferSchema>>({
    resolver: zodResolver(internalTransferSchema),
    defaultValues: { amount: 0 },
  });

  async function onSubmit(values: z.infer<typeof internalTransferSchema>) {
    setIsLoading(true);

    const payload = {
      fromId: values.from,
      toId: values.to,
      amount: values.amount / rate,
      note: values.note,
    };

    try {
      const token = await getAccessTokenSilently();

      await api.post('/transactions/internal-transfer', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Transfer completed successfully');
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

  const otherAccounts = useMemo(() => accounts.filter((a) => a._id !== form.watch('from')), []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
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
            <AccountSelect label="To" userAccounts={otherAccounts} field={field} />
          )}
        />
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
