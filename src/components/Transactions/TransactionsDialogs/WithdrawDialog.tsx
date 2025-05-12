'use client';

import { useState } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { useUserContext } from '@/context/UserContext';
import { useAuth0 } from '@auth0/auth0-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/currencies';
import AccountSelect from '@/components/Forms/AccountSelect';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

interface WithdrawDialogProps {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}

function WithdrawDialog({ isVisible, setIsVisible }: WithdrawDialogProps) {
  const { currency, rate } = useCurrency();
  const { accounts, refetchAccountsAndTransactions } = useUserContext();
  const { getAccessTokenSilently } = useAuth0();

  const [isLoading, setIsLoading] = useState(false);

  const withdrawSchema = z
    .object({
      account: z.string({ required_error: 'Please select an account' }),
      amount: z.coerce.number({ required_error: 'Please enter an amount' }).positive(),
      note: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      const account = accounts.find((a) => a._id === data.account);
      if (!account) {
        ctx.addIssue({
          code: 'custom',
          message: 'Selected account not found.',
          path: ['account'],
        });
      } else if (data.amount > account.balance * rate) {
        ctx.addIssue({
          code: 'custom',
          message: `You can't withdraw more than your balance of ${formatCurrency(
            account.balance * rate,
            currency,
          )}.`,
          path: ['amount'],
        });
      }
    });

  const form = useForm<z.infer<typeof withdrawSchema>>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: { amount: 0 },
  });

  async function onSubmit(values: z.infer<typeof withdrawSchema>) {
    setIsLoading(true);
    const payload = {
      accountId: values.account,
      amount: values.amount / rate,
      note: values.note,
    };

    const token = await getAccessTokenSilently();

    try {
      await api.post('/transactions/withdraw', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Withdrawal submitted');
      await refetchAccountsAndTransactions();
      form.reset();
      setIsVisible(false);
    } catch (err) {
      toast.error('Something went wrong during withdrawal');
    } finally {
      setIsLoading(false);
    }
  }

  function closeDialog() {
    form.reset();
    setIsVisible(false);
  }

  return (
    <Dialog
      open={isVisible}
      onOpenChange={(open) => {
        if (!open) closeDialog();
      }}
    >
      <DialogContent onInteractOutside={closeDialog}>
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>
            Withdraw money from one of your accounts. Make sure the amount, method, and destination
            are correct before submitting.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <span>{currency}</span>
                      <Input
                        {...field}
                        placeholder="Enter an amount"
                        type="number"
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="account"
              render={({ field }) => (
                <AccountSelect
                  label="Account"
                  userAccounts={accounts}
                  field={field}
                  disabled={isLoading}
                />
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
                      placeholder="What's this withdrawal for?"
                      className="resize-none"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full grid grid-cols-2 gap-2">
              <Button variant="ghost" type="reset" onClick={closeDialog} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                Withdraw
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default WithdrawDialog;
