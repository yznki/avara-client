'use client';

import { useCurrency } from '@/context/CurrencyContext';
import { useTransactionRange } from '@/context/TransactionRangeContext';
import { Pie, PieChart } from 'recharts';
import { formatCurrency } from '@/lib/currencies';
import { filterTransactionsByRange } from '@/lib/filterTransactionsByRange';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  type ChartConfig,
} from '@/components/ui/chart';
import { mockTransactions } from '../TransactionsDataTable/mockTransactions';
import { ChartRangeToggle } from './ChartRangeToggle';

const chartConfig = {
  amount: {
    label: 'Amount',
  },
  deposit: {
    label: 'Deposit',
    color: 'var(--chart-1)',
  },
  withdrawal: {
    label: 'Withdrawal',
    color: 'var(--chart-2)',
  },
  internal_transfer: {
    label: 'Internal Transfer',
    color: 'var(--chart-3)',
  },
  external_transfer: {
    label: 'External Transfer',
    color: 'var(--chart-4)',
  },
} satisfies ChartConfig;

const chartColors = {
  deposit: '#4ade80',
  withdrawal: '#f87171',
  internal_transfer: '#60a5fa',
  external_transfer: '#facc15',
};

const CustomPieTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (!active || !payload || !payload.length) return null;

  const { name, payload: data } = payload[0];

  return (
    <div className="rounded-md border bg-background px-3 py-2 text-sm shadow-md">
      <div className="font-medium">
        {chartConfig[name as keyof typeof chartConfig]?.label ?? name}
      </div>
      <div className="text-muted-foreground">{data.formattedLabel}</div>
    </div>
  );
};

export default function SpendingBreakdownChart() {
  const { currency, rate } = useCurrency();

  const { range } = useTransactionRange();
  const filtered = filterTransactionsByRange(mockTransactions, range);

  const typeTotals = filtered.reduce(
    (acc, tx) => {
      acc[tx.type] = (acc[tx.type] ?? 0) + tx.amount;
      return acc;
    },
    {} as Record<string, number>,
  );

  const chartData = Object.entries(typeTotals).map(([type, amount]) => ({
    type,
    amount,
    formattedLabel: formatCurrency(amount * rate, currency),
    fill: chartColors[type as keyof typeof chartColors],
  }));

  return (
    <Card>
      <CardHeader className="flex items-center justify-between pb-0">
        <CardTitle>Spending Breakdown</CardTitle>
        <ChartRangeToggle />
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto min-h-[200px]">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="type"
              innerRadius={64}
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
                    fill="hsl(var(--muted-foreground))"
                    className="text-xs font-semibold"
                  >
                    {payload.formattedLabel}
                  </text>
                );
              }}
            />
            <ChartLegend
              layout="radial"
              verticalAlign="middle"
              align="right"
              content={<ChartLegendContent nameKey="type" />}
              className="flex flex-col gap-2"
            />
            <ChartTooltip content={<CustomPieTooltip />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
