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

interface DepositDialogProps {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}

const depositSchema = z.object({
  account: z.string({ required_error: 'Please select an account' }),
  amount: z.coerce
    .number({ required_error: 'Please enter an amount' })
    .positive()
    .lte(100000, { message: "We can't deposit that huge amount!" }),
  note: z.string().optional(),
});

function DepositDialog({ isVisible, setIsVisible }: DepositDialogProps) {
  const { currency, rate } = useCurrency();
  const { getAccessTokenSilently } = useAuth0();
  const { accounts, refetchAccountsAndTransactions } = useUserContext();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof depositSchema>>({
    resolver: zodResolver(depositSchema),
    defaultValues: { amount: 0 },
  });

  async function onSubmit(values: z.infer<typeof depositSchema>) {
    if (isLoading) return;

    setIsLoading(true);

    const payload = {
      accountId: values.account,
      amount: values.amount / rate,
      note: values.note,
    };

    try {
      const token = await getAccessTokenSilently();
      const headers = { Authorization: `Bearer ${token}` };

      await api.post('/transactions/deposit', payload, { headers });

      toast.success('Deposit successful');
      await refetchAccountsAndTransactions();
      closeDialog();
    } catch (err: any) {
      const code = err.response?.status;
      if (code === 400) toast.error('Invalid input');
      else if (code === 403) toast.error('Unauthorized or account not found');
      else if (code === 500) toast.error('Deposit failed');
      else toast.error('Unexpected error');
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
        form.reset();
        setIsVisible(open);
      }}
    >
      <DialogContent onInteractOutside={closeDialog}>
        <DialogHeader>
          <DialogTitle>Deposit Funds</DialogTitle>
          <DialogDescription>
            Add money to one of your accounts. Make sure the amount and account are correct before
            submitting.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <span>{currency}</span>
                        <Input {...field} placeholder="Enter an amount" type="number" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="account"
              render={({ field }) => (
                <AccountSelect label="Account" userAccounts={accounts} field={field} />
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
                      placeholder="A little something to make you remember this deposit..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full grid grid-cols-2 gap-2">
              <Button variant="ghost" type="reset" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default DepositDialog;
