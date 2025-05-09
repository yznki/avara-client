'use client';

import { useCurrency } from '@/context/CurrencyContext';
import { mockUserAccounts } from '@/types/account';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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

  const withdrawSchema = z
    .object({
      account: z.string({ required_error: 'Please select an account' }),
      amount: z.coerce.number({ required_error: 'Please enter an amount' }).positive(),
      note: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      const account = mockUserAccounts.find((a) => a._id === data.account);
      if (!account) {
        ctx.addIssue({
          code: 'custom',
          message: 'Selected account not found.',
          path: ['account'],
        });
      } else if (data.amount > account.balance) {
        ctx.addIssue({
          code: 'custom',
          message: `You can't withdraw more than your balance of ${formatCurrency(account.balance * rate, currency)}.`,
          path: ['amount'],
        });
      }
    });

  const form = useForm<z.infer<typeof withdrawSchema>>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: { amount: 0 },
  });

  function onSubmit(values: z.infer<typeof withdrawSchema>) {
    values.amount = values.amount / rate;
    console.log('Withdraw request:', values);
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
                      <Input {...field} placeholder="Enter an amount" type="number" />
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
                <AccountSelect label="Account" userAccounts={mockUserAccounts} field={field} />
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
              <Button type="submit">Withdraw</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default WithdrawDialog;
