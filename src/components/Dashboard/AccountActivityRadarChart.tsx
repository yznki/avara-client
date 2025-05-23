'use client';

import { useMemo } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import type { AccountResponse } from '@/types/account';
import type { TransactionResponse } from '@/types/transaction';
import { TrendingUp } from 'lucide-react';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, Tooltip } from 'recharts';
import { formatCurrency } from '@/lib/currencies';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';

interface Props {
  transactions: TransactionResponse[];
  accounts: AccountResponse[];
}

export function AccountActivityRadarChart({ transactions, accounts }: Props) {
  const { currency, rate } = useCurrency();

  const data = useMemo(() => {
    const metrics = [
      'Deposit',
      'Withdrawal',
      'Internal Sent',
      'Internal Received',
      'External Sent',
      'External Received',
    ];

    const result = metrics.map((metric) => ({
      metric,
      checking: 0,
      savings: 0,
      investment: 0,
    }));

    const getTypeIndex = (label: string) => result.findIndex((r) => r.metric === label);

    for (const tx of transactions) {
      const fromAcc = accounts.find((a) => a._id === tx.fromAccountId);
      const toAcc = accounts.find((a) => a._id === tx.toAccountId);

      if (tx.type === 'deposit' && toAcc) {
        result[getTypeIndex('Deposit')][toAcc.accountType] += tx.amount;
      }

      if (tx.type === 'withdrawal' && fromAcc) {
        result[getTypeIndex('Withdrawal')][fromAcc.accountType] += tx.amount;
      }

      if (tx.type === 'internal_transfer') {
        if (fromAcc) result[getTypeIndex('Internal Sent')][fromAcc.accountType] += tx.amount;
        if (toAcc) result[getTypeIndex('Internal Received')][toAcc.accountType] += tx.amount;
      }

      if (tx.type === 'external_transfer') {
        if (fromAcc) result[getTypeIndex('External Sent')][fromAcc.accountType] += tx.amount;
        if (toAcc) result[getTypeIndex('External Received')][toAcc.accountType] += tx.amount;
      }
    }

    return result.map((entry) => ({
      ...entry,
      checking: Number((entry.checking * rate).toFixed(2)),
      savings: Number((entry.savings * rate).toFixed(2)),
      investment: Number((entry.investment * rate).toFixed(2)),
    }));
  }, [transactions, accounts, rate]);

  const chartConfig = {
    checking: { label: 'Checking', color: 'var(--chart-1)' },
    savings: { label: 'Savings', color: 'var(--chart-3)' },
    investment: { label: 'Investment', color: 'var(--chart-5)' },
  };

  const isEmpty = data.every((d) => d.checking === 0 && d.savings === 0 && d.investment === 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Activity</CardTitle>
        <CardDescription>
          See how each account type is used across different transaction types
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center text-muted-foreground text-sm h-64 animate-fade-in">
            <img src="/empty-states/empty-graph-3.svg" alt="No data" className="w-64 h-40 mb-4" />
            <span>No account activity to display yet.</span>
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <RadarChart data={data}>
              <PolarGrid />
              <PolarAngleAxis
                dataKey="metric"
                tickFormatter={(label) => label.replace(' ', '\n')}
              />
              <PolarRadiusAxis
                tickFormatter={(val) => {
                  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
                  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}k`;
                  return val.toFixed(0);
                }}
              />
              <Tooltip formatter={(val: number) => formatCurrency(val, currency)} />
              {(['checking', 'savings', 'investment'] as const).map((type) => (
                <Radar
                  key={type}
                  name={chartConfig[type].label}
                  dataKey={type}
                  stroke={chartConfig[type].color}
                  fill={chartConfig[type].color}
                  fillOpacity={0.2}
                />
              ))}
            </RadarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {isEmpty ? 'No account usage yet' : 'Most used account types per activity'}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Aggregated totals by transaction type and account
        </div>
      </CardFooter>
    </Card>
  );
}
