'use client';

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const chartData = [
  { month: 'January', balance: 1200 },
  { month: 'February', balance: 1350 },
  { month: 'March', balance: 1600 },
  { month: 'April', balance: 1800 },
  { month: 'May', balance: 1700 },
  { month: 'June', balance: 1900 },
];

const chartConfig = {
  balance: {
    label: 'Balance',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export function BalanceHistoryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance History</CardTitle>
        <CardDescription>
          January - {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date())}{' '}
          {new Date().getFullYear()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(val) => val.slice(0, 3)}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={10} width={40} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Line
              dataKey="balance"
              type="natural"
              stroke="var(--color-balance)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
