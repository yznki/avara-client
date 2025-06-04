'use client';

import { useMemo } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import type { AccountResponse } from '@/types/account';
import { Wallet } from 'lucide-react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { abbreviateNumber, formatCurrency } from '@/lib/currencies';
import CustomLegend from '@/components/Dashboard/AccountBalanceHistoryChart/CustomLegend';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltip, type ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  checking: {
    label: 'Checking',
    color: 'var(--chart-1)',
  },
  savings: {
    label: 'Savings',
    color: 'var(--chart-3)',
  },
  investment: {
    label: 'Investment',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig;

const chartColors = {
  checking: 'var(--chart-1)',
  savings: 'var(--chart-3)',
  investment: 'var(--chart-5)',
};

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (!active || !payload || !payload.length) return null;
  const { name, payload: data } = payload[0];

  return (
    <div className="rounded-md border bg-background px-3 py-2 text-sm shadow-md text-foreground">
      <div className="font-medium">{name}</div>
      <div className="text-muted-foreground">{data.fullLabel}</div>
    </div>
  );
};

export function AccountBalanceDonutChart({ accounts }: { accounts: AccountResponse[] }) {
  const { currency, rate } = useCurrency();

  const chartData = useMemo(() => {
    const totals = {
      checking: 0,
      savings: 0,
      investment: 0,
    };

    for (const account of accounts) {
      totals[account.accountType] += account.balance;
    }

    return Object.entries(totals)
      .filter(([, val]) => val > 0)
      .map(([type, amount]) => ({
        type: chartConfig[type as keyof typeof chartConfig].label,
        value: amount,
        abbreviatedLabel: `${abbreviateNumber(amount * rate)} ${currency}`,
        fullLabel: formatCurrency(amount * rate, currency),
        fill: chartColors[type as keyof typeof chartColors],
      }));
  }, [accounts, rate, currency]);

  const isEmpty = chartData.length === 0;

  return (
    <Card>
      <CardHeader className="flex items-center justify-between pb-0">
        <div className="space-y-1">
          <CardTitle>Total Account Balances</CardTitle>
          <CardDescription>Visual breakdown by account type</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center text-muted-foreground text-sm h-64 animate-fade-in">
            <img
              src="/empty-states/empty-admin-chart-2.svg"
              alt="No data"
              className="w-48 h-32 mb-4"
            />
            <span>No account balances available.</span>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="mx-auto">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="type"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  labelLine={false}
                  label={({ payload, ...props }) => (
                    <text
                      cx={props.cx}
                      cy={props.cy}
                      x={props.x}
                      y={props.y}
                      textAnchor={props.textAnchor}
                      dominantBaseline={props.dominantBaseline}
                      fill="var(--muted-foreground)"
                      className="text-xs font-semibold"
                    >
                      {payload.abbreviatedLabel}
                    </text>
                  )}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend content={<CustomLegend />} />
                <ChartTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Balance by account type <Wallet className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground">All values reflect the current account state</div>
      </CardFooter>
    </Card>
  );
}
