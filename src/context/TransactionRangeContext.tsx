'use client';

import { createContext, useContext, useState } from 'react';

type Range = '30D' | '6M' | '1Y';

const TransactionRangeContext = createContext<{
  range: Range;
  setRange: (value: Range) => void;
} | null>(null);

export const useTransactionRange = () => {
  const ctx = useContext(TransactionRangeContext);
  if (!ctx) throw new Error('useTransactionRange must be used within TransactionRangeProvider');
  return ctx;
};

export function TransactionRangeProvider({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState<Range>('6M');
  return (
    <TransactionRangeContext.Provider value={{ range, setRange }}>
      {children}
    </TransactionRangeContext.Provider>
  );
}
