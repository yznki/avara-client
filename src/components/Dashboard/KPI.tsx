'use client';

import React from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { abbreviateNumber } from '@/lib/currencies';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface KPIProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'muted';
  isCurrency?: boolean;
  loading?: boolean;
}

const colorVariants: Record<NonNullable<KPIProps['color']>, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  muted: 'text-muted-foreground',
};

export const KPI: React.FC<KPIProps> = ({
  title,
  value,
  icon,
  color = 'primary',
  isCurrency,
  loading = false,
}) => {
  const { currency, rate } = useCurrency();

  const formattedValue = isCurrency
    ? `${abbreviateNumber((value as number) * rate)} ${currency}`
    : value.toString();

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
        <div className={cn('text-2xl', colorVariants[color])}>{icon}</div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-10 w-3/4 rounded-md" />
        ) : (
          <div className={cn('text-5xl font-semibold tracking-tight', colorVariants[color])}>
            {formattedValue}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
