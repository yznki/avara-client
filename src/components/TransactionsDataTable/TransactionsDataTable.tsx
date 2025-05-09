import { useMemo, useState } from 'react';
import type { AccountResponse } from '@/types/account';
import type { TransactionResponse } from '@/types/transaction';
import { DataTable } from '../DataTable/DataTable';
import { columns, type TransactionTableEntry } from './Columns';
import { Toolbar } from './Toolbar';

interface TransactionsDataTableProps {
  transactions?: TransactionResponse[];
  accounts: AccountResponse[];
}

function TransactionsDataTable({ transactions, accounts }: TransactionsDataTableProps) {
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

  function formatAccount(
    accountId: string | null,
    accounts: TransactionsDataTableProps['accounts'],
  ) {
    if (!accountId) return null;
    const acc = accounts.find((a) => a._id === accountId);
    if (!acc) return 'Unknown';
    const suffix = accountId.slice(-4);
    return `${capitalize(acc.type)} - ****${suffix}`;
  }

  function capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  return (
    <div className="hidden sm:block">
      <Toolbar
        onSearchChange={setSearch}
        onTypeFilterChange={setTypeFilter}
        searchValue={search}
        typeFilter={typeFilter}
      />
      <DataTable columns={columns} data={filteredData} />
    </div>
  );
}

export default TransactionsDataTable;
