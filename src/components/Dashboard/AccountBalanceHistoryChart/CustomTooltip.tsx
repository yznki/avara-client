import { useCurrency } from '@/context/CurrencyContext';
import { type TooltipProps } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { formatCurrency } from '@/lib/currencies';

interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  chartConfig: Record<string, { label: string; color: string }>;
}

export function CustomTooltip({ active, payload, label, chartConfig }: CustomTooltipProps) {
  const { currency, rate } = useCurrency();

  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-md border bg-popover p-3 shadow-sm text-sm text-foreground min-w-[180px]">
      <div className="mb-1 font-semibold text-muted-foreground">{label}</div>
      <div className="space-y-1">
        {payload.map((entry) => {
          const key = entry.dataKey?.toString() ?? '';
          const config = chartConfig[key];
          if (!config) return null;

          return (
            <div key={key} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-sm"
                  style={{ backgroundColor: config.color }}
                />
                <span>{config.label}</span>
              </div>
              <span className="font-medium tabular-nums">
                {formatCurrency(Number(entry.value) * rate, currency)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
