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
}

function AccountSelect({ label, field, userAccounts }: AccountSelectProps) {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an account" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {userAccounts.map((account) => (
            <SelectItem key={account._id} value={account._id}>
              {getAccountName(account.type)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
}

export default AccountSelect;
