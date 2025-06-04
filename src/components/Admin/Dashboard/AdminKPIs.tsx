'use client';

import type { AccountResponse } from '@/types/account';
import type { TransactionResponse } from '@/types/transaction';
import type { UserResponse } from '@/types/user';
import { DollarSign, Repeat, UserPlus, Users, Wallet } from 'lucide-react';
import { KPI } from '@/components/Dashboard/KPI';

interface AdminKPIsProps {
  users: UserResponse[];
  accounts: AccountResponse[];
  transactions: TransactionResponse[];
  loading: boolean;
}

export default function AdminKPIs({ users, accounts, transactions, loading }: AdminKPIsProps) {
  const today = new Date().toISOString().split('T')[0];
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const transactionsToday = transactions.filter((tx) => {
    const created = typeof tx.createdAt === 'string' ? tx.createdAt : tx.createdAt.toISOString();
    return created.startsWith(today);
  });

  const volumeToday = transactionsToday.reduce((sum, tx) => sum + tx.amount, 0);

  const newUsersThisWeek = users.filter((u) => {
    const created = new Date(u.createdAt);
    return created >= oneWeekAgo;
  }).length;

  return (
    <div className="flex gap-4 flex-col md:flex-row sm:flex-wrap md:flex-nowrap">
      <KPI
        title="Total Users"
        value={users.length}
        icon={<Users size={32} />}
        color="primary"
        loading={loading}
      />
      <KPI
        title="Total Accounts"
        value={accounts.length}
        icon={<Wallet size={32} />}
        color="muted"
        loading={loading}
      />
      <KPI
        title="Transactions Today"
        value={transactionsToday.length}
        icon={<Repeat size={32} />}
        color="secondary"
        loading={loading}
      />
      <KPI
        title="Total Volume Today"
        value={volumeToday}
        icon={<DollarSign size={32} />}
        color="primary"
        isCurrency
        loading={loading}
      />
      <KPI
        title="New Users This Week"
        value={newUsersThisWeek}
        icon={<UserPlus size={32} />}
        color="muted"
        loading={loading}
      />
    </div>
  );
}
