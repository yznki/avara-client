'use client';

import { useCurrency } from '@/context/CurrencyContext';
import { getCurrencySymbol } from '@/lib/currencies';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSidebar } from '@/components/ui/sidebar';

export function CurrencySelect() {
  const { currency, setCurrency, rates } = useCurrency();
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === 'collapsed' && !isMobile;

  return (
    <Select value={currency} onValueChange={setCurrency}>
      <SelectTrigger
        className={cn(
          'rounded-md border bg-background text-sm',
          isCollapsed ? 'w-8 h-8 p-0 justify-center [&_svg]:hidden' : 'w-full h-9 px-3',
        )}
        size={isCollapsed ? 'sm' : 'default'}
      >
        <SelectValue placeholder={currency}>
          <span className={cn(isCollapsed ? 'text-xs font-medium' : 'text-sm font-semibold')}>
            {isCollapsed
              ? getCurrencySymbol(currency)
              : `${getCurrencySymbol(currency)} ${currency}`}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.keys(rates)
          .sort()
          .map((code) => (
            <SelectItem key={code} value={code}>
              <div className="flex items-center gap-2">
                <span className="font-medium">{code}</span>
              </div>
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
