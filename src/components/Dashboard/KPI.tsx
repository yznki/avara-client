'use client';

import React from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { formatCurrency } from '@/lib/currencies';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface KPIProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'muted';
  isCurrency?: boolean;
}

const colorVariants: Record<NonNullable<KPIProps['color']>, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  muted: 'text-muted-foreground',
};

export const KPI: React.FC<KPIProps> = ({ title, value, icon, color = 'primary', isCurrency }) => {
  const { currency, rate } = useCurrency();

  const formattedValue = isCurrency
    ? formatCurrency((value as number) * rate, currency)
    : value.toString();

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
        <div className={cn('text-2xl', colorVariants[color])}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className={cn('text-5xl font-semibold tracking-tight', colorVariants[color])}>
          {formattedValue}
        </div>
      </CardContent>
    </Card>
  );
};
