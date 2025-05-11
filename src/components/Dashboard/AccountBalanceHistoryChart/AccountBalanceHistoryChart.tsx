import { useMemo } from 'react';
import type { AccountResponse, AccountType } from '@/types/account';
import type { TransactionResponse } from '@/types/transaction';
import { format } from 'date-fns';
import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import { ChartContainer, ChartTooltip, type ChartConfig } from '../../ui/chart';
import CustomLegend from './CustomLegend';
import { CustomTooltip } from './CustomTooltip';

interface Props {
  transactions: TransactionResponse[];
  accounts: AccountResponse[];
}

export function AccountBalanceHistoryChart({ transactions, accounts }: Props) {
  const { chartData, rangeLabel } = useMemo(() => {
    if (transactions.length === 0) return { chartData: [], rangeLabel: 'No data' };

    const dateList = transactions.map((tx) => new Date(tx.createdAt));
    const sorted = dateList.sort((a, b) => a.getTime() - b.getTime());
    const start = sorted[0];
    const end = sorted[sorted.length - 1];

    const months = [];
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    const last = new Date(end.getFullYear(), end.getMonth(), 1);
    while (cursor <= last) {
      months.push(format(cursor, 'MMM yyyy'));
      cursor.setMonth(cursor.getMonth() + 1);
    }

    const base = months.map((month) => ({
      month,
      checking: 0,
      savings: 0,
      investment: 0,
    }));

    for (const tx of transactions) {
      const txDate = new Date(tx.createdAt);
      const month = format(txDate, 'MMM yyyy');
      const entry = base.find((m) => m.month === month);
      if (!entry) continue;

      const acc = accounts.find((a) => a._id === tx.toAccountId || a._id === tx.fromAccountId);
      if (!acc) continue;

      const sign =
        tx.type === 'deposit' || tx.toAccountId === acc._id
          ? 1
          : tx.type === 'withdrawal' || tx.fromAccountId === acc._id
            ? -1
            : 0;

      entry[acc.accountType] += tx.amount * sign;
    }

    return {
      chartData: base,
      rangeLabel: `${format(start, 'MMM yyyy')} – ${format(end, 'MMM yyyy')}`,
    };
  }, [transactions, accounts]);

  const chartConfig = {
    checking: { label: 'Checking', color: 'var(--chart-1)' },
    savings: { label: 'Savings', color: 'var(--chart-3)' },
    investment: { label: 'Investment', color: 'var(--chart-5)' },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance Trends</CardTitle>
        <CardDescription>Monthly inflows and outflows across all your accounts</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-muted-foreground text-sm h-64 animate-fade-in">
            <img src="/empty-states/empty-graph-4.svg" alt="No data" className="w-64 h-40 mb-4" />
            <span>No account activity to display yet.</span>
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <AreaChart data={chartData} margin={{ right: 12 }}>
              <CartesianGrid vertical={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(val) => {
                  if (Math.abs(val) >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
                  if (Math.abs(val) >= 1_000) return `${(val / 1_000).toFixed(1)}k`;
                  return val.toFixed(0);
                }}
              />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<CustomTooltip chartConfig={chartConfig} />} />
              <Legend
                verticalAlign="top"
                align="center"
                iconType="circle"
                wrapperStyle={{ fontSize: '0.75rem', paddingBottom: 16 }}
                content={<CustomLegend />}
              />
              <defs>
                {(['checking', 'savings', 'investment'] as AccountType[]).map((type) => (
                  <linearGradient key={type} id={`fill-${type}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={`var(--color-${type})`} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={`var(--color-${type})`} stopOpacity={0.1} />
                  </linearGradient>
                ))}
              </defs>
              {(['checking', 'savings', 'investment'] as AccountType[]).map((type) => (
                <Area
                  key={type}
                  type="monotone"
                  dataKey={type}
                  stroke={`var(--color-${type})`}
                  fill={`url(#fill-${type})`}
                  fillOpacity={0.4}
                  stackId="a"
                />
              ))}
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {chartData.length === 0 ? 'No trend to show yet' : "You're growing!"}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground">{rangeLabel}</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
