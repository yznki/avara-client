import { useUserContext } from '@/context/UserContext';
import { mockUserAccounts } from '@/types/account';
import Overview from '@/components/Accounts/Overview';
import { Separator } from '@/components/ui/separator';

export default function Accounts() {
  const { accounts, transactions } = useUserContext();

  return (
    <div className="grid gap-16 py-4 px-1">
      {accounts.map((account, index) => (
        <div key={account._id} className="grid gap-16">
          <Overview account={account} userTransactions={transactions} onDelete={() => {}} />
          {index < mockUserAccounts.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  );
}
