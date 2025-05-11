import { useUserContext } from '@/context/UserContext';
import { mockUserAccounts } from '@/types/account';
import Overview from '@/components/Accounts/Overview';
import { Separator } from '@/components/ui/separator';

export default function Accounts() {
  const { accounts } = useUserContext();

  return (
    <div className="grid gap-16 py-4 px-1">
      {accounts.map((account, index) => (
        <div className="grid gap-16">
          <Overview key={account._id} account={account} userTransactions={[]} onDelete={() => {}} />
          {index < mockUserAccounts.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  );
}
