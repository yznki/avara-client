'use client';

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

  const chartData = Object.entries(monthlyData).map(([month, balance]) => ({
    month: format(new Date(month + '-01'), 'MMMM'),
    balance: balance * rate,
    formatted: formatCurrency(balance * rate, currency),
  }));

  return (
    <Card>
      <CardHeader className="flex items-center justify-between pb-0">
        <CardTitle>Balance History</CardTitle>
        <ChartRangeToggle />
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={10} tick={{ fontSize: 12 }} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Line
              dataKey="balance"
              type="natural"
              stroke="var(--color-balance)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
