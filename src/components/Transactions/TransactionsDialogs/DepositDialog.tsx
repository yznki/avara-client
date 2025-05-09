'use client';

import { useCurrency } from '@/context/CurrencyContext';
import { mockUserAccounts } from '@/types/account';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
  onConfirm: () => void;
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

  const form = useForm<z.infer<typeof depositSchema>>({
    resolver: zodResolver(depositSchema),
    defaultValues: { amount: 0 },
  });

  function onSubmit(values: z.infer<typeof depositSchema>) {
    // Change to USD for API call
    values.amount = values.amount / rate;
    console.log(values.amount);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  function closeDialog() {
    form.reset();
    setIsVisible(false);
  }

  return (
    <Dialog open={isVisible} onOpenChange={setIsVisible}>
      <DialogContent onInteractOutside={() => setIsVisible(false)}>
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
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default DepositDialog;
