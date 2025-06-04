'use client';

import type { UserResponse } from '@/types/user';
import type { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export type UserTableEntry = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  profilePicture: string;
};

export const columns: ColumnDef<UserResponse>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const user = row.original;
      const initials = user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profilePicture} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{user.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <Badge
          className={`capitalize ${
            role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
          }`}
        >
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return <span>{date.toLocaleDateString()}</span>;
    },
  },
];
