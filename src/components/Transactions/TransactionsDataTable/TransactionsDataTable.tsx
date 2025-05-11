import { useMemo, useState } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import type { AccountResponse } from '@/types/account';
import type { TransactionResponse } from '@/types/transaction';
import { formatCurrency } from '@/lib/currencies';
import { DataTable } from '../../DataTable/DataTable';
import { Badge } from '../../ui/badge';
import { columns, type TransactionTableEntry } from './Columns';
import { Toolbar } from './Toolbar';

interface TransactionsDataTableProps {
  transactions?: TransactionResponse[];
  accounts: AccountResponse[];
}

function TransactionsDataTable({ transactions, accounts }: TransactionsDataTableProps) {
  const { rate, currency } = useCurrency();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const mappedData: TransactionTableEntry[] = useMemo(() => {
    return (
      transactions?.map((tx) => ({
        id: tx._id,
        type: tx.type,
        amount: tx.amount,
        date: tx.createdAt,
        from: formatAccount(tx.fromAccountId, accounts),
        to: formatAccount(tx.toAccountId, accounts),
        note: tx.note,
      })) || []
    );
  }, [transactions, accounts]);

  const filteredData = useMemo(() => {
    return mappedData.filter((tx) => {
      const matchesSearch =
        tx.note?.toLowerCase().includes(search.toLowerCase()) ||
        tx.from?.toLowerCase().includes(search.toLowerCase()) ||
        tx.to?.toLowerCase().includes(search.toLowerCase());

      const matchesType = typeFilter === 'all' || tx.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [mappedData, search, typeFilter]);

  function getTransactionTypeBadge(type: TransactionTableEntry['type']) {
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
  }

  function formatAccount(
    accountId: string | null,
    accounts: TransactionsDataTableProps['accounts'],
  ) {
    if (!accountId) return null;
    const acc = accounts.find((a) => a._id === accountId);
    if (!acc) return 'Unknown';
    const suffix = accountId.slice(-4);
    return `${capitalize(acc.accountType)} - ****${suffix}`;
  }

  function capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  return (
    <div>
      <Toolbar
        onSearchChange={setSearch}
        onTypeFilterChange={setTypeFilter}
        searchValue={search}
        typeFilter={typeFilter}
      />

      {/* Desktop table */}
      <div className="hidden sm:block">
        <DataTable columns={columns} data={filteredData} />
      </div>

      {/* Mobile card layout */}
      <div className="block sm:hidden space-y-2">
        {filteredData.map((tx) => (
          <div key={tx.id} className="border rounded-lg p-4 shadow-sm bg-card text-card-foreground">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{getTransactionTypeBadge(tx.type)}</span>
              <span className="text-sm font-semibold text-primary">
                {formatCurrency(tx.amount * rate, currency)}
              </span>
            </div>

            <div className="mt-2 text-sm space-y-1">
              {tx.from && (
                <div>
                  <strong>From:</strong> {tx.from}
                </div>
              )}
              {tx.to && (
                <div>
                  <strong>To:</strong> {tx.to}
                </div>
              )}
              <div>
                <strong>Date:</strong> {new Date(tx.date).toLocaleDateString()}
              </div>
              {tx.note && (
                <div>
                  <strong>Note:</strong> {tx.note}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionsDataTable;
