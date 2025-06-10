import { useCurrency } from '@/context/CurrencyContext';
import { useUserContext } from '@/context/UserContext';
import { getAccountName, type AccountResponse } from '@/types/account';
import type { TransactionResponse } from '@/types/transaction';
import { ExternalLink, PiggyBank, Trash2, Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/currencies';
import { KPI } from '../Dashboard/KPI';
import TransactionsDataTable from '../TransactionsDataTable/TransactionsDataTable';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

interface OverviewProps {
  account: AccountResponse;
  userTransactions: TransactionResponse[];
  onDelete?: (account: AccountResponse) => void;
  isDeleting?: boolean;
}

function Overview({ account, userTransactions, onDelete, isDeleting }: OverviewProps) {
  const { accounts } = useUserContext();

  const { currency, rate } = useCurrency();

  const canDelete = account.accountType !== 'checking';

  const filteredTransactions = userTransactions.filter(
    (tx) => tx.fromAccountId === account._id || tx.toAccountId === account._id,
  );

  const depositsThisMonth = userTransactions.reduce((acc, tx) => {
    if (tx.type === 'deposit' && tx.toAccountId === account._id) {
      acc += tx.amount;
    }
    return acc;
  }, 0);

  const spendingThisMonth = userTransactions.reduce((acc, tx) => {
    if (tx.type === 'withdrawal' && tx.fromAccountId === account._id) {
      acc += tx.amount;
    }
    return acc;
  }, 0);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <h2 className="text-2xl font-bold">{getAccountName(account.accountType)}</h2>
        {canDelete && onDelete && (
          <AlertDialog>
            <AlertDialogTrigger
              className="bg-red-500 hover:bg-red-600 hover:cursor-pointer p-1 text-white rounded-sm disabled:opacity-50"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="text-xs px-1">Deleting...</span>
              ) : (
                <Trash2 size={16} />
              )}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your account and transfer the balance to your
                  checking account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(account)}
                  className="bg-red-500 hover:bg-red-600 hover:cursor-pointer"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Continue'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPI
          title="Current Balance"
          value={formatCurrency(account.balance * rate, currency)}
          icon={<Wallet size={32} />}
        />
        <KPI
          title="This Month's Spending"
          value={formatCurrency(spendingThisMonth * rate, currency)}
          icon={<ExternalLink size={32} />}
        />
        <KPI
          title="Deposits This Month"
          value={formatCurrency(depositsThisMonth * rate, currency)}
          icon={<PiggyBank size={32} />}
        />
      </div>

      <div className="grid gap-2">
        <span className="text-lg font-semibold">Recent Transactions</span>
        <TransactionsDataTable transactions={filteredTransactions} accounts={accounts} />
      </div>
    </div>
  );
}

export default Overview;
