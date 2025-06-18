'use client';

import { useMemo } from 'react';
import type { TransactionResponse } from '@/types/transaction';
import { CreditCard } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
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
  deposit: { label: 'Deposit', color: 'var(--chart-1)' },
  withdrawal: { label: 'Withdrawal', color: 'var(--chart-2)' },
  internal_transfer: { label: 'Internal T.', color: 'var(--chart-3)' },
  external_transfer: { label: 'External T.', color: 'var(--chart-4)' },
} satisfies ChartConfig;

export function TransactionsByTypeBarChart({
  transactions,
}: {
  transactions: TransactionResponse[];
}) {
  const data = useMemo(() => {
    const map: Record<keyof typeof chartConfig, number> = {
      deposit: 0,
      withdrawal: 0,
      internal_transfer: 0,
      external_transfer: 0,
    };

    for (const tx of transactions) {
      map[tx.type as keyof typeof chartConfig]++;
    }

    return Object.entries(map).map(([type, count]) => ({
      type: chartConfig[type as keyof typeof chartConfig].label,
      count,
      fill: chartConfig[type as keyof typeof chartConfig].color,
    }));
  }, [transactions]);

  const isEmpty = data.every((d) => d.count === 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions by Type</CardTitle>
        <CardDescription>Total transactions grouped by type</CardDescription>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center text-muted-foreground text-sm h-64 animate-fade-in">
            <img
              src="/empty-states/empty-admin-chart-3.svg"
              alt="No transactions"
              className="w-60 h-36 mb-4"
            />
            <span>No transaction data available.</span>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="min-h-[250px]">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="type" axisLine={false} tickLine={false} tickMargin={8} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Transaction types <CreditCard className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground">Includes deposits, withdrawals & transfers</div>
      </CardFooter>
    </Card>
  );
}
