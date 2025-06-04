'use client';

import { useEffect, useState } from 'react';
import type { AccountResponse } from '@/types/account';
import type { TransactionResponse } from '@/types/transaction';
import type { UserResponse } from '@/types/user';
import { useAuth0 } from '@auth0/auth0-react';
import { getAdminTransactions, getAllAccounts, getAllUsers } from '@/lib/admin';
import { AccountBalanceDonutChart } from '@/components/Admin/Charts/AccountBalanceDonutChart';
import AdminChartSkeleton from '@/components/Admin/Charts/AdminChartSkeleton';
import { TopActiveUsersChart } from '@/components/Admin/Charts/TopActiveUsersChart';
import { TransactionVolumeAreaChart } from '@/components/Admin/Charts/TransactionVolumeAreaChart';
import { TransactionVolumeBarChart } from '@/components/Admin/Charts/TransactionVolumeBarChart';
import { UserGrowthChart } from '@/components/Admin/Charts/UserGrowthChart';
import AdminKPIs from '@/components/Admin/Dashboard/AdminKPIs';

const AdminDashboard = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState<UserResponse[]>([]);
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);

  useEffect(() => {
    async function fetchAllAdminData() {
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
        console.error('Error loading admin dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAllAdminData();
  }, [getAccessTokenSilently]);

  return (
    <div className="flex flex-col gap-4 py-4">
      <AdminKPIs users={users} accounts={accounts} transactions={transactions} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {loading ? <AdminChartSkeleton title="User Growth" /> : <UserGrowthChart users={users} />}

        {loading ? (
          <AdminChartSkeleton title="Transaction Volume" description="By transaction type" />
        ) : (
          <TransactionVolumeBarChart transactions={transactions} />
        )}

        {loading ? (
          <AdminChartSkeleton title="Account Balances" description="By account type" />
        ) : (
          <AccountBalanceDonutChart accounts={accounts} />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <AdminChartSkeleton title="Top Active Users" />
        ) : (
          <TopActiveUsersChart users={users} accounts={accounts} transactions={transactions} />
        )}

        {loading ? (
          <AdminChartSkeleton title="Transaction Volume Over Time" />
        ) : (
          <TransactionVolumeAreaChart transactions={transactions} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
