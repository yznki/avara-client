import { useMemo, useState } from 'react';
import { DataTable } from '../DataTable/DataTable';
import { columns } from './Columns';
import { mockTransactionsTableEntries } from './mockTransactions';
import { Toolbar } from './Toolbar';

function TransactionsDataTable() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredData = useMemo(() => {
    return mockTransactionsTableEntries.filter((tx) => {
      const matchesSearch =
        tx.note?.toLowerCase().includes(search.toLowerCase()) ||
        tx.from?.toLowerCase().includes(search.toLowerCase()) ||
        tx.to?.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || tx.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [mockTransactionsTableEntries, search, typeFilter]);

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
