'use client';

import { useMemo } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import type { TransactionResponse } from '@/types/transaction';
import { format, parseISO } from 'date-fns';
import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { abbreviateNumber, getCurrencySymbol } from '@/lib/currencies';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface Props {
  transactions: TransactionResponse[];
}

export function TransactionVolumeAreaChart({ transactions }: Props) {
  const { currency, rate } = useCurrency();

  const chartData = useMemo(() => {
    const dailyTotals: Record<string, number> = {};

    for (const tx of transactions) {
      const date = format(new Date(tx.createdAt), 'yyyy-MM-dd');
      dailyTotals[date] = (dailyTotals[date] ?? 0) + tx.amount;
    }

    return Object.entries(dailyTotals)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, volume]) => ({
        date,
        volume,
      }));
  }, [transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Volume</CardTitle>
        <CardDescription>Daily total transaction volume</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            volume: {
              label: 'Volume',
              color: 'var(--chart-1)',
            },
          }}
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ left: 12, right: 12, bottom: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => format(parseISO(value), 'MMM d')}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tick={{ fontSize: 12 }}
                tickFormatter={(val) =>
                  `${abbreviateNumber(val * rate)} ${getCurrencySymbol(currency)}`
                }
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(val) =>
                      `${abbreviateNumber(Number(val) * rate)} ${getCurrencySymbol(currency)}`
                    }
                  />
                }
              />
              <defs>
                <linearGradient id="fillVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <Area
                dataKey="volume"
                type="monotone"
                fill="url(#fillVolume)"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={{ fill: 'var(--chart-1)', r: 2 }}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Based on real transaction data
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
