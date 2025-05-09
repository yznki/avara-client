'use client';

import { useMemo } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { mockUserAccounts } from '@/types/account';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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

    const fromAccount = mockUserAccounts.find((a) => a._id === data.from);
    if (!fromAccount) {
      ctx.addIssue({
        code: 'custom',
        path: ['from'],
        message: 'Source account not found.',
      });
    } else if (data.amount > fromAccount.balance) {
      ctx.addIssue({
        code: 'custom',
        path: ['amount'],
        message: `Insufficient balance. Max: ${fromAccount.balance}`,
      });
    }
  });

export default function InternalTransferForm({ onSuccess }: InternalTransferFormProps) {
  const { currency, rate } = useCurrency();

  const form = useForm<z.infer<typeof internalTransferSchema>>({
    resolver: zodResolver(internalTransferSchema),
    defaultValues: {
      amount: 0,
    },
  });

  function onSubmit(values: z.infer<typeof internalTransferSchema>) {
    const payload = {
      ...values,
      amount: values.amount / rate,
    };

    console.log('Internal Transfer:', payload);
    onSuccess();
  }

  function onCancel() {
    form.reset();
    onSuccess();
  }

  const otherAccounts = useMemo(() => mockUserAccounts, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
        <FormField
          control={form.control}
          name="from"
          render={({ field }) => (
            <AccountSelect label="From" userAccounts={mockUserAccounts} field={field} />
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
          <Button variant="ghost" type="reset" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Transfer</Button>
        </div>
      </form>
    </Form>
  );
}
