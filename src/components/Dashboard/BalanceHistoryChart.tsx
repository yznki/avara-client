'use client';

import { useMemo } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { useTransactionRange } from '@/context/TransactionRangeContext';
import { useUserContext } from '@/context/UserContext';
import { format } from 'date-fns';
import { Activity } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '@/lib/currencies';
import { filterTransactionsByRange } from '@/lib/filterTransactionsByRange';
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
import { ChartRangeToggle } from './ChartRangeToggle';

const chartConfig = {
  balance: {
    label: 'Balance',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export function BalanceHistoryChart() {
  const { currency, rate } = useCurrency();
  const { transactions } = useUserContext();

  const { range } = useTransactionRange();
  const filtered = filterTransactionsByRange(transactions, range);

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
        <div className="space-y-1">
          <CardTitle>Balance History</CardTitle>
          <CardDescription>Net transaction value by month based on filtered range</CardDescription>
        </div>
        <ChartRangeToggle />
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-muted-foreground text-sm h-64 animate-fade-in">
            <img
              src="/empty-states/empty-graph-1.svg"
              alt="No transactions"
              className="w-64 h-40 mb-4"
            />
            <span>No transactions found for this range.</span>
          </div>
        ) : (
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
                    notation: 'compact',
                  }).format(val)
                }
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(val) => formatCurrency(Number(val) * rate, currency)}
                  />
                }
              />
              <Line
                dataKey="balance"
                type="natural"
                stroke="var(--color-balance)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-balance)' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Monthly transaction movement <Activity className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground">
          Based on transaction totals (withdrawals reduce balance)
        </div>
      </CardFooter>
    </Card>
  );
}
