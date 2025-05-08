'use client';

import { Pie, PieChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const chartData = [
  { type: 'Withdraw', amount: 720, fill: 'var(--color-chart-1)' },
  { type: 'Deposit', amount: 920, fill: 'var(--color-chart-2)' },
  { type: 'Internal T.', amount: 460, fill: 'var(--color-chart-3)' },
  { type: 'External T.', amount: 310, fill: 'var(--color-chart-4)' },
];

const chartConfig = {
  amount: {
    label: 'Amount',
  },
  Withdraw: {
    label: 'Withdraw',
    color: 'var(--chart-1)',
  },
  Deposit: {
    label: 'Deposit',
    color: 'var(--chart-2)',
  },
  'Internal T.': {
    label: 'Internal T.',
    color: 'var(--chart-3)',
  },
  'External T.': {
    label: 'External T.',
    color: 'var(--chart-4)',
  },
} satisfies ChartConfig;

export default function SpendingBreakdownChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Spending Breakdown</CardTitle>
        <CardDescription>
          January – {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date())}{' '}
          {new Date().getFullYear()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto min-h-[200px]">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="type"
              labelLine={false}
              label={({ payload, ...props }) => {
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="hsla(var(--foreground))"
                  >
                    {payload.amount}
                  </text>
                );
              }}
              innerRadius={64}
            />
            <ChartLegend
              layout="radial"
              verticalAlign="middle"
              align="right"
              content={<ChartLegendContent nameKey="type" />}
              className="flex flex-col gap-2"
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="min-w-[140px] px-3 py-2 text-sm rounded-md shadow-md"
                  hideLabel
                />
              }
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
