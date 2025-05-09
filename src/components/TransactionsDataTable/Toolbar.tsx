'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Props = {
  onSearchChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  searchValue: string;
  typeFilter: string;
};

export function Toolbar({ onSearchChange, onTypeFilterChange, searchValue, typeFilter }: Props) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-2">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search by note or account..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />

        <Select value={typeFilter} onValueChange={onTypeFilterChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="deposit">Deposit</SelectItem>
            <SelectItem value="withdrawal">Withdrawal</SelectItem>
            <SelectItem value="internal_transfer">Internal Transfer</SelectItem>
            <SelectItem value="external_transfer">External Transfer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          onSearchChange('');
          onTypeFilterChange('all');
        }}
      >
        Clear filters
      </Button>
    </div>
  );
}
