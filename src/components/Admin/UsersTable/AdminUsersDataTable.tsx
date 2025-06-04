'use client';

import { useMemo, useState } from 'react';
import type { UserResponse } from '@/types/user';
import { DataTable } from '@/components/DataTable/DataTable';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { columns } from './Columns';

interface Props {
  users: UserResponse[];
  onUserClick?: (user: UserResponse) => void;
}

export default function AdminUsersDataTable({ users, onUserClick }: Props) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()),
    );
  }, [users, search]);

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {/* Desktop */}
      <div className="hidden sm:block">
        <DataTable
          columns={columns}
          data={filtered}
          initialPageSize={10}
          onRowClick={onUserClick}
        />
      </div>

      {/* Mobile */}
      <div className="block sm:hidden space-y-3">
        {!filtered.length && (
          <div className="text-center text-muted-foreground text-sm">No users found.</div>
        )}
        {filtered.map((user) => (
          <div
            key={user._id}
            onClick={() => onUserClick?.(user)}
            className="border rounded-lg p-4 shadow-sm bg-card text-card-foreground cursor-pointer hover:bg-muted/30"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.profilePicture} />
                <AvatarFallback>
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-3">
              <Badge
                className={`capitalize ${
                  user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {user.role}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
