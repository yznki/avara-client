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
  users: { label: 'Users', color: 'var(--chart-1)' },
} satisfies ChartConfig;

export function UsersPerDayLineChart({ users }: { users: UserResponse[] }) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const user of users) {
      const date = new Date(user.createdAt).toISOString().split('T')[0];
      counts[date] = (counts[date] || 0) + 1;
    }

    return Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));
  }, [users]);

  const totals = data.map((d) => d.count);
  const min = totals.length ? Math.min(...totals, 0) : 0;
  const max = totals.length ? Math.max(...totals, 10) : 10;
  const ticks = Array.from({ length: 5 }, (_, i) => min + ((max - min) / 4) * i);
  const isEmpty = data.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Users Per Day</CardTitle>
        <CardDescription>Registrations grouped by date</CardDescription>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center text-muted-foreground text-sm h-64 animate-fade-in">
            <img
              src="/empty-states/empty-admin-chart-5.svg"
              alt="No users"
              className="w-60 h-36 mb-4"
            />
            <span>No user data available.</span>
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
                      formatter={(value) => `${value} users`}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={chartConfig.users.color}
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
          Daily signups <Users className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground">
          Represents the number of new users registered each day
        </div>
      </CardFooter>
    </Card>
  );
}
