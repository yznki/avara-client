'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

type CurrencyContextType = {
  currency: string;
  rate: number;
  setCurrency: (code: string) => void;
  rates: Record<string, number>;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);
const CURRENCY_API_URL = `https://api.freecurrencyapi.com/v1/latest?apikey=${import.meta.env.VITE_CURRENCY_API_KEY}`;

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState('USD');
  const [rate, setRate] = useState(1);
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1 });

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const cached = localStorage.getItem('currencyCache');
    const parsed = cached ? JSON.parse(cached) : null;

    if (parsed?.date === today && parsed?.rates) {
      setRates(parsed.rates);
    } else {
      axios
        .get(CURRENCY_API_URL)
        .then((res) => {
          const rateMap = res.data.data;
          setRates(rateMap);
          localStorage.setItem('currencyCache', JSON.stringify({ date: today, rates: rateMap }));
        })
        .catch(console.error);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('selectedCurrency');
    if (saved) setCurrency(saved);
  }, [rates]);

  const setCurrency = (code: string) => {
    setCurrencyState(code);
    localStorage.setItem('selectedCurrency', code);
    setRate(rates[code] || 1);
  };

  return (
    <CurrencyContext.Provider value={{ currency, rate, setCurrency, rates }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
