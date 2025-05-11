'use client';

import { useMemo } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import type { TransactionResponse } from '@/types/transaction';
import { format } from 'date-fns';
import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '@/lib/currencies';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';

interface Props {
  transactions: TransactionResponse[];
}

export function MonthlyNetFlowBarChart({ transactions }: Props) {
  const { currency, rate } = useCurrency();

  const { data, rangeLabel } = useMemo(() => {
    if (transactions.length === 0) return { data: [], rangeLabel: 'No data' };

    const txDates = transactions.map((tx) => new Date(tx.createdAt));
    const sorted = [...txDates].sort((a, b) => a.getTime() - b.getTime());
    const start = new Date(sorted[0].getFullYear(), sorted[0].getMonth(), 1);
    const end = new Date(
      sorted[sorted.length - 1].getFullYear(),
      sorted[sorted.length - 1].getMonth(),
      1,
    );

    const months: string[] = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      months.push(format(cursor, 'MMM yyyy'));
      cursor.setMonth(cursor.getMonth() + 1);
    }

    const monthMap: Record<string, number> = {};
    months.forEach((m) => (monthMap[m] = 0));

    for (const tx of transactions) {
      const date = new Date(tx.createdAt);
      const month = format(date, 'MMM yyyy');
      if (!(month in monthMap)) continue;

      const sign = tx.type === 'deposit' || tx.type === 'internal_transfer' ? 1 : -1;
      monthMap[month] += sign * tx.amount;
    }

    const data = months.map((month) => {
      const value = monthMap[month];
      return {
        month,
        net: value,
        fill: value >= 0 ? '#28c76f' : '#ef4444',
      };
    });

    return {
      data,
      rangeLabel: `${format(start, 'MMM yyyy')} – ${format(end, 'MMM yyyy')}`,
    };
  }, [transactions]);

  const chartConfig = {
    net: {
      label: 'Net Flow',
      color: 'transparent',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Net Flow</CardTitle>
        <CardDescription>Shows monthly net cash movement (inflows - outflows)</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-muted-foreground text-sm h-64 animate-fade-in">
            <img
              src="/empty-states/empty-graph-5.svg"
              alt="No transactions"
              className="w-64 h-40 mb-4"
            />
            <span>No transaction flow data available.</span>
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart data={data} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(val) => {
                  if (Math.abs(val) >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
                  if (Math.abs(val) >= 1_000) return `${(val / 1_000).toFixed(0)}k`;
                  return val.toFixed(0);
                }}
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                formatter={(value: number) => formatCurrency(value * rate, currency)}
              />
              <Bar dataKey="net" radius={[4, 4, 0, 0]} isAnimationActive={true} fill="#000" />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {data.length === 0 ? 'No trend to show yet' : 'Net inflow trend'}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground">{rangeLabel}</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
