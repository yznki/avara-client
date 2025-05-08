'use client';

import { useCurrency } from '@/context/CurrencyContext';
import type { ColumnDef } from '@tanstack/react-table';
import { formatCurrency } from '@/lib/currencies';
import { Badge } from '../ui/badge';

export type TransactionTableEntry = {
  id: string;
  type: 'deposit' | 'withdrawal' | 'internal_transfer' | 'external_transfer';
  amount: number;
  date: string | Date;
  from: string | null;
  to: string | null;
  note?: string;
};

export const columns: ColumnDef<TransactionTableEntry>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const value = row.getValue('date');

      const date =
        value instanceof Date ? value : typeof value === 'string' ? new Date(value) : undefined;

      if (!date) return <span className="text-muted-foreground">Invalid date</span>;

      const formatted = new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);

      return <span>{formatted}</span>;
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type') as TransactionTableEntry['type'];

      const badgeColors = {
        deposit: 'bg-green-100 text-green-800',
        withdrawal: 'bg-red-100 text-red-800',
        internal_transfer: 'bg-blue-100 text-blue-800',
        external_transfer: 'bg-yellow-100 text-yellow-800',
      };

      return (
        <Badge variant="outline" className={`px-2 text-xs capitalize ${badgeColors[type]}`}>
          {type.replace('_', ' ')}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-left">Amount</div>,
    cell: ({ row }) => {
      const { currency, rate } = useCurrency();

      const amount = parseFloat(row.getValue('amount'));
      const formatted = formatCurrency(amount * rate, currency);

      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'from',
    header: 'From',
    cell: ({ row }) => {
      const value = row.getValue('from');
      return <span>{typeof value === 'string' && value.trim() ? value : '—'}</span>;
    },
  },
  {
    accessorKey: 'to',
    header: 'To',
    cell: ({ row }) => {
      const value = row.getValue('to');
      return <span>{typeof value === 'string' && value.trim() ? value : '—'}</span>;
    },
  },
  {
    accessorKey: 'note',
    header: 'Note',
    cell: ({ row }) => {
      const value = row.getValue('note');
      const safeTitle = typeof value === 'string' ? value : '';
      return (
        <span title={safeTitle}>{typeof value === 'string' && value.trim() ? value : '—'}</span>
      );
    },
  },
];
