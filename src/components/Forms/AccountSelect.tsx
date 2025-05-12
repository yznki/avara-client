import { getAccountName, type AccountResponse } from '@/types/account';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormControl, FormItem, FormLabel, FormMessage } from '../ui/form';

interface AccountSelectProps {
  label: string;
  field: any;
  userAccounts: AccountResponse[];
  disabled?: boolean;
}

function AccountSelect({ label, field, userAccounts, disabled }: AccountSelectProps) {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
        <FormControl>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an account" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {userAccounts.map((account) => (
            <SelectItem key={account._id} value={account._id}>
              {getAccountName(account.accountType)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
}

export default AccountSelect;
