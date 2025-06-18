'use client';

import { useMemo } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import type { TransactionResponse } from '@/types/transaction';
import { TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '@/lib/currencies';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const chartConfig = {
  volume: { label: 'Volume', color: 'var(--chart-5)' },
} satisfies ChartConfig;

export function TransactionVolumeLineChart({
  transactions,
}: {
  transactions: TransactionResponse[];
}) {
  const { currency, rate } = useCurrency();

  const data = useMemo(() => {
    const map: Record<string, number> = {};

    for (const tx of transactions) {
      const date = new Date(tx.createdAt).toISOString().split('T')[0];
      map[date] = (map[date] || 0) + tx.amount;
    }

    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, amount]) => ({ date, amount }));
  }, [transactions]);

  const totals = data.map((d) => d.amount);
  const min = totals.length ? Math.min(...totals, 0) : 0;
  const max = totals.length ? Math.max(...totals, 100) : 100;
  const ticks = Array.from({ length: 5 }, (_, i) => min + ((max - min) / 4) * i);
  const isEmpty = data.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Volume</CardTitle>
        <CardDescription>Daily transaction amounts</CardDescription>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center text-muted-foreground text-sm h-64 animate-fade-in">
            <img
              src="/empty-states/empty-admin-chart-4.svg"
              alt="No transaction volume"
              className="w-60 h-36 mb-4"
            />
            <span>No transaction data available.</span>
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  tickFormatter={(v) => v.slice(5)}
                />
                <YAxis
                  domain={[min, max]}
                  ticks={ticks}
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(label) => `Date: ${label}`}
                      formatter={(value) => formatCurrency(Number(value) * rate, currency)}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke={chartConfig.volume.color}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Daily volume <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground">Represents total transaction amounts per day</div>
      </CardFooter>
    </Card>
  );
}
