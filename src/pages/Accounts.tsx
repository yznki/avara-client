import { EAccountType, type AccountResponse } from '@/types/account';
import Overview from '@/components/Accounts/Overview';
import { Separator } from '@/components/ui/separator';

export default function Accounts() {
  const userAccounts: AccountResponse[] = [
    {
      _id: '1',
      userId: 'user1',
      type: EAccountType.Checking,
      balance: 5000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: '2',
      userId: 'user1',
      type: EAccountType.Savings,
      balance: 15000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: '3',
      userId: 'user1',
      type: EAccountType.Investment,
      balance: -2000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return (
    <div className="grid gap-4 py-4 px-1">
      {userAccounts.map((account, index) => (
        <div className="grid gap-4">
          <Overview key={account._id} account={account} userTransactions={[]} onDelete={() => {}} />
          {index < userAccounts.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  );
}
