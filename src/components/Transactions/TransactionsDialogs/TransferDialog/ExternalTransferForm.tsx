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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const mockUsers = [
  { name: 'Ali Hassan', email: 'ali@example.com' },
  { name: 'Fatima Zayed', email: 'fatima@example.com' },
  { name: 'Yazan Kiswani', email: 'yzn@gmail.com' },
];

interface ExternalTransferFormProps {
  onSuccess: () => void;
}

const externalTransferSchema = z
  .object({
    to: z.string({ required_error: 'Please select a user' }).email(),
    from: z.string({ required_error: 'Please select a source account' }),
    amount: z.coerce.number({ required_error: 'Please enter an amount' }).positive(),
    note: z.string().optional(),
  })
  .superRefine((data, ctx) => {
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

export default function ExternalTransferForm({ onSuccess }: ExternalTransferFormProps) {
  const { currency, rate } = useCurrency();

  const form = useForm<z.infer<typeof externalTransferSchema>>({
    resolver: zodResolver(externalTransferSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const userOptions = useMemo(() => mockUsers, []);

  function onSubmit(values: z.infer<typeof externalTransferSchema>) {
    const payload = {
      ...values,
      amount: values.amount / rate,
    };

    console.log('External Transfer:', payload);
    onSuccess();
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
              <AccountSelect label="From" userAccounts={mockUserAccounts} field={field} />
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
                      {userOptions.map((user) => (
                        <SelectItem key={user.email} value={user.email}>
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
          <Button variant="ghost" type="reset" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Transfer</Button>
        </div>
      </form>
    </Form>
  );
}
