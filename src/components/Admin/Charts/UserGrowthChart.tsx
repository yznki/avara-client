'use client';

import { useMemo } from 'react';
import type { UserResponse } from '@/types/user';
import { Users } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
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
  total: {
    label: 'Users',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

interface Props {
  users: UserResponse[];
}

export function UserGrowthChart({ users }: Props) {
  const data = useMemo(() => {
    const growthMap: Record<string, number> = {};

    for (const user of users) {
      const date = new Date(user.createdAt).toISOString().split('T')[0]; // 'YYYY-MM-DD'
      growthMap[date] = (growthMap[date] || 0) + 1;
    }

    const sorted = Object.entries(growthMap).sort(([a], [b]) => a.localeCompare(b));

    let total = 0;
    return sorted.map(([date, count]) => {
      total += count;
      return {
        date,
        total,
      };
    });
  }, [users]);

  const totals = data.map((d) => d.total);
  const min = Math.min(...totals) - 10;
  const max = Math.max(...totals) + 10;
  const step = 10;

  const ticks = useMemo(() => {
    const roundedMin = Math.floor(min / step) * step;
    const roundedMax = Math.ceil(max / step) * step;
    const values = [];
    for (let i = roundedMin; i <= roundedMax; i += step) {
      values.push(i);
    }
    return values;
  }, [min, max]);

  const isEmpty = data.length === 0;

  return (
    <Card>
      <CardHeader className="flex items-center justify-between pb-0">
        <div className="space-y-1">
          <CardTitle>User Growth</CardTitle>
          <CardDescription>Cumulative user registrations by date</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center text-muted-foreground text-sm h-64 animate-fade-in">
            <img
              src="/empty-states/empty-admin-chart-1.svg"
              alt="No data"
              className="w-48 h-32 mb-4"
            />
            <span>No user data available.</span>
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(val) => val.slice(5)}
                />
                <YAxis
                  domain={[min, max]}
                  ticks={ticks}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip
                  content={<ChartTooltipContent formatter={(val) => `${val} users`} />}
                />
                <Line
                  dataKey="total"
                  type="natural"
                  stroke="var(--color-total)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-total)' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total user growth <Users className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground">Based on account creation date</div>
      </CardFooter>
    </Card>
  );
}
