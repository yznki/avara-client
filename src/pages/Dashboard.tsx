import { ArrowUpRight, PiggyBank, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BalanceHistoryChart } from '@/components/Dashboard/BalanceHistoryChart';
import { KPI } from '@/components/Dashboard/KPI';
import SpendingBreakdownChart from '@/components/Dashboard/SpendingBreakdownChart';
import { mockTransactions } from '@/components/TransactionsDataTable/mockTransactions';
import TransactionsDataTable from '@/components/TransactionsDataTable/TransactionsDataTable';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const navigate = useNavigate();

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
      <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2">
        <BalanceHistoryChart />
        <SpendingBreakdownChart />
      </div>
      <div className="grid gap-2">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
        <div className="flex flex-col gap-4 sm:hidden">
          {mockTransactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="rounded-lg border p-4 shadow-sm">
              <div className="flex justify-between text-sm">
                <span className="font-semibold capitalize">{tx.type.replace('_', ' ')}</span>
                <span className="text-muted-foreground">
                  {new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  }).format(new Date(tx.date))}
                </span>
              </div>
              <div className="mt-2 text-lg font-bold">{tx.amount.toLocaleString()} ₩</div>
              {tx.note && <div className="text-sm text-muted-foreground">{tx.note}</div>}
            </div>
          ))}
        </div>
        <div className="sm:hidden flex justify-center">
          <Button variant="outline" size="sm" onClick={() => navigate('/transactions')}>
            View Full Transaction History
          </Button>
        </div>
        <TransactionsDataTable />
      </div>
    </div>
  );
}
