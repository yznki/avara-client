'use client';

import { useEffect, useState } from 'react';
import type { AccountResponse } from '@/types/account';
import type { TransactionResponse } from '@/types/transaction';
import type { UserResponse } from '@/types/user';
import { useAuth0 } from '@auth0/auth0-react';
import { getAdminTransactions, getAllAccounts, getAllUsers } from '@/lib/admin';
import { AccountsPerTypeBarChart } from '@/components/Admin/ReportsCharts/AccountsPerTypeBarChart';
import { TopAccountsPieChart } from '@/components/Admin/ReportsCharts/TopAccountsPieChart';
import { TransactionsByTypeBarChart } from '@/components/Admin/ReportsCharts/TransactionsByTypeBarChart';
import { TransactionVolumeLineChart } from '@/components/Admin/ReportsCharts/TransactionVolumeLineChart';
import { UsersPerDayLineChart } from '@/components/Admin/ReportsCharts/UsersPerDayLineChart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Reports() {
  const { getAccessTokenSilently } = useAuth0();

  const [, setLoading] = useState(true);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);

  const [search, setSearch] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const token = await getAccessTokenSilently();
        const [usersRes, accountsRes, txRes] = await Promise.all([
          getAllUsers(token),
          getAllAccounts(token),
          getAdminTransactions(token),
        ]);
        setUsers(usersRes.data);
        setAccounts(accountsRes.data);
        setTransactions(txRes.data);
      } catch (err) {
        console.error('Failed to load reports data', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [getAccessTokenSilently]);

  const filteredUsers = search === 'all' ? users : users.filter((u) => u._id === search);

  const filteredAccounts = accounts.filter((acc) =>
    filteredUsers.some((u) => u._id === acc.userId),
  );

  const accountIds = new Set(filteredAccounts.map((a) => a._id));

  const filteredTransactions = transactions.filter((tx) => {
    if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
    if (startDate && new Date(tx.createdAt) < new Date(startDate)) return false;
    if (endDate && new Date(tx.createdAt) > new Date(endDate)) return false;

    if (
      tx.fromAccountId &&
      !accountIds.has(tx.fromAccountId) &&
      tx.toAccountId &&
      !accountIds.has(tx.toAccountId)
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex flex-wrap items-end gap-4">
        <Select value={search} onValueChange={setSearch}>
          <SelectTrigger className="w-60">
            <SelectValue placeholder="Filter by user" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            {users.map((u) => (
              <SelectItem key={u._id} value={u._id}>
                {u.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <span>-</span>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="deposit">Deposit</SelectItem>
            <SelectItem value="withdrawal">Withdrawal</SelectItem>
            <SelectItem value="internal_transfer">Internal Transfer</SelectItem>
            <SelectItem value="external_transfer">External Transfer</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={() => {
            setSearch('all');
            setTypeFilter('all');
            setStartDate('');
            setEndDate('');
          }}
        >
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UsersPerDayLineChart users={filteredUsers} />
        <AccountsPerTypeBarChart accounts={filteredAccounts} />
        <TopAccountsPieChart accounts={filteredAccounts} users={filteredUsers} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionsByTypeBarChart transactions={filteredTransactions} />
        <TransactionVolumeLineChart transactions={filteredTransactions} />
      </div>
    </div>
  );
}
