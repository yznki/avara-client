import { mockUserAccounts } from '@/types/account';
import { ArrowUpRight, PiggyBank, Wallet } from 'lucide-react';
import { AccountActivityRadarChart } from '@/components/Dashboard/AccountActivityRadarChart';
import { AccountBalanceHistoryChart } from '@/components/Dashboard/AccountBalanceHistoryChart/AccountBalanceHistoryChart';
import { BalanceHistoryChart } from '@/components/Dashboard/BalanceHistoryChart';
import { KPI } from '@/components/Dashboard/KPI';
import { MonthlyNetFlowBarChart } from '@/components/Dashboard/MonthlyNetFlowBarChart';
import SpendingBreakdownChart from '@/components/Dashboard/SpendingBreakdownChart';
import { mockTransactions } from '@/components/TransactionsDataTable/mockTransactions';

export default function Dashboard() {
  const balance = 1250;
  const spending = 1250;
  const deposits = 1250;

  return (
    <div className="flex flex-col gap-6 py-4">
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
        <AccountBalanceHistoryChart transactions={mockTransactions} accounts={mockUserAccounts} />
        <MonthlyNetFlowBarChart transactions={mockTransactions} />
        <AccountActivityRadarChart transactions={mockTransactions} accounts={mockUserAccounts} />
      </div>
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        <BalanceHistoryChart />
        <SpendingBreakdownChart />
      </div>
    </div>
  );
}
