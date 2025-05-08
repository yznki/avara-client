'use client';

import { useMemo } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { useTransactionRange } from '@/context/TransactionRangeContext';
import { format } from 'date-fns';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '@/lib/currencies';
import { filterTransactionsByRange } from '@/lib/filterTransactionsByRange';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { mockTransactions } from '../TransactionsDataTable/mockTransactions';
import { ChartRangeToggle } from './ChartRangeToggle';

const chartConfig = {
  balance: {
    label: 'Balance',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export function BalanceHistoryChart() {
  const { currency, rate } = useCurrency();
  const { range } = useTransactionRange();
  const filtered = filterTransactionsByRange(mockTransactions, range);

  const monthlyData = filtered.reduce(
    (acc, tx) => {
      const key = format(new Date(tx.createdAt), 'yyyy-MM');
      acc[key] = (acc[key] ?? 0) + (tx.type === 'withdrawal' ? -tx.amount : tx.amount);
      return acc;
    },
    {} as Record<string, number>,
  );

  const chartData = Object.entries(monthlyData)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([month, balance]) => ({
      month: format(new Date(month + '-01'), 'LLLL'),
      balance: balance * rate,
      formatted: formatCurrency(balance * rate, currency),
    }));

  const min = Math.min(...chartData.map((d) => d.balance)) - 500 * rate;
  const max = Math.max(...chartData.map((d) => d.balance)) + 500 * rate;
  const step = 500;

  const ticks = useMemo(() => {
    const roundedMin = Math.floor(min / step) * step;
    const roundedMax = Math.ceil(max / step) * step;
    const values = [];
    for (let i = roundedMin; i <= roundedMax; i += step) {
      values.push(i);
    }
    return values;
  }, [min, max]);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between pb-0">
        <CardTitle>Balance History</CardTitle>
        <ChartRangeToggle />
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              domain={[min, max]}
              ticks={ticks}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fontSize: 12 }}
              tickFormatter={(val) =>
                new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency,
                  notation: 'compact', // shows 2K instead of 2,000
                }).format(val)
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent formatter={(val) => formatCurrency(Number(val), currency)} />
              }
            />
            <Line
              dataKey="balance"
              type="natural"
              stroke="var(--color-balance)"
              strokeWidth={2}
              dot={{
                fill: 'var(--color-balance)',
              }}
              activeDot={{
                r: 5,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
