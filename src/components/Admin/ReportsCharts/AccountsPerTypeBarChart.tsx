'use client';

import { useMemo } from 'react';
import type { AccountResponse } from '@/types/account';
import { Wallet } from 'lucide-react';
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
  accounts: AccountResponse[];
}

const chartConfig = {
  checking: { label: 'Checking', color: 'var(--chart-2)' },
  savings: { label: 'Savings', color: 'var(--chart-3)' },
  investment: { label: 'Investment', color: 'var(--chart-4)' },
} satisfies ChartConfig;

export function AccountsPerTypeBarChart({ accounts }: Props) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {
      checking: 0,
      savings: 0,
      investment: 0,
    };

    for (const acc of accounts) {
      counts[acc.accountType]++;
    }

    return Object.entries(counts).map(([type, value]) => ({
      type: chartConfig[type as keyof typeof chartConfig].label,
      value,
      fill: chartConfig[type as keyof typeof chartConfig].color,
    }));
  }, [accounts]);

  const isEmpty = data.every((d) => d.value === 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accounts by Type</CardTitle>
        <CardDescription>Distribution of accounts across all types</CardDescription>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center text-muted-foreground text-sm h-64 animate-fade-in">
            <img
              src="/empty-states/empty-admin-chart-1.svg"
              alt="No account data"
              className="w-64 h-40 mb-4"
            />
            <span>No account data available.</span>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="min-h-[250px]">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="type" axisLine={false} tickLine={false} tickMargin={8} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tickMargin={8} />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  content={<ChartTooltipContent formatter={(v) => `${v} accounts`} />}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Account distribution <Wallet className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground">Includes all account types created by users</div>
      </CardFooter>
    </Card>
  );
}
