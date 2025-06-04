'use client';

import { useMemo } from 'react';
import type { AccountResponse } from '@/types/account';
import type { TransactionResponse } from '@/types/transaction';
import type { UserResponse } from '@/types/user';
import { BarChart2 } from 'lucide-react';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

interface Props {
  users: UserResponse[];
  accounts: AccountResponse[];
  transactions: TransactionResponse[];
}

export function TopActiveUsersChart({ users, accounts, transactions }: Props) {
  const accountUserMap = useMemo(() => {
    const map = new Map<string, string>();
    accounts.forEach((a) => map.set(a._id, a.userId));
    return map;
  }, [accounts]);

  const userNameMap = useMemo(() => {
    const map = new Map<string, string>();
    users.forEach((u) => map.set(u._id, u.name || u.email));
    return map;
  }, [users]);

  const data = useMemo(() => {
    const userTxCount: Record<string, number> = {};

    for (const tx of transactions) {
      const fromUser = tx.fromAccountId ? accountUserMap.get(tx.fromAccountId) : null;
      const toUser = tx.toAccountId ? accountUserMap.get(tx.toAccountId) : null;

      if (fromUser) userTxCount[fromUser] = (userTxCount[fromUser] ?? 0) + 1;
      if (toUser && toUser !== fromUser) userTxCount[toUser] = (userTxCount[toUser] ?? 0) + 1;
    }

    return Object.entries(userTxCount)
      .map(([userId, count]) => ({
        name: userNameMap.get(userId) ?? 'Unknown',
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [transactions, accountUserMap, userNameMap]);

  const isEmpty = data.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Active Users</CardTitle>
        <CardDescription>Users with the most transactions</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center text-muted-foreground text-sm h-64 animate-fade-in">
            <img
              src="/empty-states/empty-admin-chart-4.svg"
              alt="No data"
              className="w-48 h-32 mb-4"
            />
            <span>No transactions available.</span>
          </div>
        ) : (
          <ChartContainer config={{}}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart layout="vertical" data={data} margin={{ left: 24 }}>
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={120} />
                <Tooltip />
                <Bar dataKey="count" barSize={20}>
                  {data.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {isEmpty ? 'No data to show' : 'Top user activity'}
          <BarChart2 className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground">Based on transaction count across all time</div>
      </CardFooter>
    </Card>
  );
}
