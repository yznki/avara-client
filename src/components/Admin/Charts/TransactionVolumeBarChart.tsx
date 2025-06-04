'use client';

import { useMemo } from 'react';
import type { TransactionResponse } from '@/types/transaction';
import { CreditCard } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

interface Props {
  transactions: TransactionResponse[];
}

const chartConfig = {
  deposit: { label: 'Deposit', color: '#f87171' },
  withdrawal: { label: 'Withdrawal', color: '#fb7185' },
  internal_transfer: { label: 'Internal Transfer', color: '#fca5a5' },
  external_transfer: { label: 'External Transfer', color: '#fecaca' },
} satisfies ChartConfig;

export function TransactionVolumeBarChart({ transactions }: Props) {
  const data = useMemo(() => {
    const typeCounts: Record<string, number> = {
      deposit: 0,
      withdrawal: 0,
      internal_transfer: 0,
      external_transfer: 0,
    };

    for (const tx of transactions) {
      if (tx.type in typeCounts) {
        typeCounts[tx.type]++;
      }
    }

    return Object.entries(typeCounts).map(([type, count]) => ({
      type: chartConfig[type as keyof typeof chartConfig].label,
      value: count,
      fill: chartConfig[type as keyof typeof chartConfig].color,
    }));
  }, [transactions]);

  const isEmpty = data.every((d) => d.value === 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Volume</CardTitle>
        <CardDescription>Total number of transactions by type</CardDescription>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center text-muted-foreground text-sm h-64 animate-fade-in">
            <img
              src="/empty-states/empty-admin-chart-3.svg"
              alt="No transactions"
              className="w-64 h-40 mb-4"
            />
            <span>No transaction data available.</span>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="min-h-[250px]">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="type"
                  tickLine={true}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) =>
                    value
                      .replace(/external transfer/gi, 'External T.')
                      .replace(/internal transfer/gi, 'Internal T.')
                  }
                />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tickMargin={8} />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  content={<ChartTooltipContent formatter={(v) => `${v} transactions`} />}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {isEmpty ? 'No data to show' : 'Breakdown of transactions'}
          <CreditCard className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground">
          Includes all deposits, withdrawals, and transfers
        </div>
      </CardFooter>
    </Card>
  );
}
