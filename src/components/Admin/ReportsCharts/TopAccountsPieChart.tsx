'use client';

import { useMemo } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import type { AccountResponse } from '@/types/account';
import type { UserResponse } from '@/types/user';
import { Star } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { abbreviateNumber, formatCurrency } from '@/lib/currencies';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltip, type ChartConfig } from '@/components/ui/chart';

interface Props {
  accounts: AccountResponse[];
  users: UserResponse[];
}

const chartConfig = {
  checking: { label: 'Checking', color: 'var(--chart-1)' },
  savings: { label: 'Savings', color: 'var(--chart-2)' },
  investment: { label: 'Investment', color: 'var(--chart-3)' },
} satisfies ChartConfig;

const chartColors = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (!active || !payload || !payload.length) return null;
  const { name, payload: data } = payload[0];

  return (
    <div className="rounded-md border bg-background px-3 py-2 text-sm shadow-md text-foreground">
      <div className="font-medium">{name}</div>
      <div className="text-muted-foreground">{data.fullLabel}</div>
    </div>
  );
};

export function TopAccountsPieChart({ accounts, users }: Props) {
  const { rate, currency } = useCurrency();

  const chartData = useMemo(() => {
    const userMap = new Map(users.map((u) => [u._id, u.name]));

    return [...accounts]
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 5)
      .map((acc, i) => {
        const value = acc.balance;
        const label = `${abbreviateNumber(value * rate)} ${currency}`;
        const fullLabel = formatCurrency(value * rate, currency);
        const accountTypeLabel = chartConfig[acc.accountType]?.label ?? acc.accountType;
        const userName = userMap.get(acc.userId) ?? 'Unknown';

        return {
          name: `${userName} (${accountTypeLabel})`,
          value,
          abbreviatedLabel: label,
          fullLabel,
          fill: chartColors[i % chartColors.length],
        };
      });
  }, [accounts, users, rate, currency]);

  const isEmpty = chartData.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Account Balances</CardTitle>
        <CardDescription>Highest balances across all accounts</CardDescription>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center text-muted-foreground text-sm h-64 animate-fade-in">
            <img
              src="/empty-states/empty-admin-chart-5.svg"
              alt="No accounts"
              className="w-60 h-36 mb-4"
            />
            <span>No account data available.</span>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="mx-auto">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label={({ payload }) => payload.abbreviatedLabel}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Top balances <Star className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground">Only the top 5 accounts by balance are shown</div>
      </CardFooter>
    </Card>
  );
}
