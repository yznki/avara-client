import { useState } from 'react';
import { mockUserAccounts } from '@/types/account';
import { ArrowDownToLine, ArrowUpToLine, Banknote } from 'lucide-react';
import DepositDialog from '@/components/Transactions/TransactionsDialogs/DepositDialog';
import WithdrawDialog from '@/components/Transactions/TransactionsDialogs/WithdrawDialog';
import { mockTransactions } from '@/components/TransactionsDataTable/mockTransactions';
import TransactionsDataTable from '@/components/TransactionsDataTable/TransactionsDataTable';
import { Button } from '@/components/ui/button';

export default function Transactions() {
  const [isDepositDialogVisible, setIsDepositDialogVisible] = useState(false);
  const [isWithdrawDialogVisible, setIsWithdrawDialogVisible] = useState(false);
  // const [isTransferDialogVisible, setIsTransferDialogVisible] = useState(false);

  const actions = [
    {
      label: 'Deposit',
      icon: <ArrowDownToLine className="size-4" />,
      onClick: () => setIsDepositDialogVisible(true),
    },
    {
      label: 'Withdraw',
      icon: <ArrowUpToLine className="size-4" />,
      onClick: () => setIsWithdrawDialogVisible(true),
    },
    {
      label: 'Transfer',
      icon: <Banknote className="size-4" />,
      onClick: () => {
        // Handle transfer action
        console.log('Transfer clicked');
      },
    },
  ];

  return (
    <>
      <div className="grid gap-4 py-4 px-1">
        <div className="flex items-center justify-between">
          <h1>Recent Transactions</h1>
          <div className="flex gap-2 items-center">
            {actions.map(({ label, icon, onClick }) => (
              <Button key={label} onClick={onClick} variant="sidebar" className="md:min-w-[160px]">
                {icon}
                <span className="hidden md:inline font-medium text-base">{label}</span>
              </Button>
            ))}
          </div>
        </div>
        <TransactionsDataTable accounts={mockUserAccounts} transactions={mockTransactions} />
      </div>

      <DepositDialog isVisible={isDepositDialogVisible} setIsVisible={setIsDepositDialogVisible} />
      <WithdrawDialog
        isVisible={isWithdrawDialogVisible}
        setIsVisible={setIsWithdrawDialogVisible}
      />
    </>
  );
}
