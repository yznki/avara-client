import { mockUserAccounts } from '@/types/account';
import Overview from '@/components/Accounts/Overview';
import { Separator } from '@/components/ui/separator';

export default function Accounts() {
  return (
    <div className="grid gap-16 py-4 px-1">
      {mockUserAccounts.map((account, index) => (
        <div className="grid gap-16">
          <Overview key={account._id} account={account} userTransactions={[]} onDelete={() => {}} />
          {index < mockUserAccounts.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  );
}
