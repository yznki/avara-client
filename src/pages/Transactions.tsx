import { useState } from 'react';
import { useUserContext } from '@/context/UserContext';
import { ArrowDownToLine, ArrowUpToLine, Banknote } from 'lucide-react';
import DepositDialog from '@/components/Transactions/TransactionsDialogs/DepositDialog';
import TransferDialog from '@/components/Transactions/TransactionsDialogs/TransferDialog/TransferDialog';
import WithdrawDialog from '@/components/Transactions/TransactionsDialogs/WithdrawDialog';
import TransactionsDataTable from '@/components/TransactionsDataTable/TransactionsDataTable';
import { Button } from '@/components/ui/button';

export default function Transactions() {
  const { transactions, accounts } = useUserContext();

  const [isDepositDialogVisible, setIsDepositDialogVisible] = useState(false);
  const [isWithdrawDialogVisible, setIsWithdrawDialogVisible] = useState(false);
  const [isTransferDialogVisible, setIsTransferDialogVisible] = useState(false);

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
      onClick: () => setIsTransferDialogVisible(true),
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
        <TransactionsDataTable
          accounts={accounts}
          transactions={transactions}
          initialPageSize={50}
        />
      </div>

      <DepositDialog isVisible={isDepositDialogVisible} setIsVisible={setIsDepositDialogVisible} />
      <WithdrawDialog
        isVisible={isWithdrawDialogVisible}
        setIsVisible={setIsWithdrawDialogVisible}
      />
      <TransferDialog
        isVisible={isTransferDialogVisible}
        setIsVisible={setIsTransferDialogVisible}
      />
    </>
  );
}
