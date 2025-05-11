import { useUserContext } from '@/context/UserContext';
import { ArrowUpRight, PiggyBank, Wallet } from 'lucide-react';
import { AccountActivityRadarChart } from '@/components/Dashboard/AccountActivityRadarChart';
import { AccountBalanceHistoryChart } from '@/components/Dashboard/AccountBalanceHistoryChart/AccountBalanceHistoryChart';
import { BalanceHistoryChart } from '@/components/Dashboard/BalanceHistoryChart';
import { KPI } from '@/components/Dashboard/KPI';
import { MonthlyNetFlowBarChart } from '@/components/Dashboard/MonthlyNetFlowBarChart';
import SpendingBreakdownChart from '@/components/Dashboard/SpendingBreakdownChart';

export default function Dashboard() {
  const { accounts, transactions } = useUserContext();

  const balance = accounts.find((account) => account.accountType === 'checking')?.balance || 0;

  const spending = transactions.reduce((acc, tx) => {
    if (tx.type != 'deposit') {
      acc += tx.amount;
    }
    return acc;
  }, 0);

  const deposits = transactions.reduce((acc, tx) => {
    if (tx.type === 'deposit') {
      acc += tx.amount;
    }
    return acc;
  }, 0);

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex gap-4 flex-col md:flex-row">
        <KPI
          title="Current Balance"
          value={balance}
          icon={<Wallet size={32} />}
          color="primary"
          isCurrency
        />
        <KPI
          title="This Month's Spending"
          value={spending}
          icon={<ArrowUpRight size={32} />}
          color="secondary"
          isCurrency
        />
        <KPI
          title="Deposits This Month"
          value={deposits}
          icon={<PiggyBank size={32} />}
          color="muted"
          isCurrency
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
        <AccountBalanceHistoryChart transactions={transactions} accounts={accounts} />
        <MonthlyNetFlowBarChart transactions={transactions} />
        <AccountActivityRadarChart transactions={transactions} accounts={accounts} />
      </div>
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        <BalanceHistoryChart />
        <SpendingBreakdownChart />
      </div>
    </div>
  );
}
