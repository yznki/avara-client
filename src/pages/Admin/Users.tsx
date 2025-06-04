import { useEffect, useState } from 'react';
import type { AccountResponse } from '@/types/account';
import type { TransactionResponse } from '@/types/transaction';
import type { UserResponse } from '@/types/user';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'sonner';
import { deleteUser, getAdminTransactions, getAllAccounts, getAllUsers } from '@/lib/admin';
import AdminUsersDataTable from '@/components/Admin/UsersTable/AdminUsersDataTable';
import UserSidebar from '@/components/Admin/UsersTable/UserSidebar';
import { Skeleton } from '@/components/ui/skeleton';

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

function Users() {
  const { getAccessTokenSilently } = useAuth0();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);

  async function handleUserDelete(user: UserResponse) {
    try {
      const token = await getAccessTokenSilently();
      await deleteUser(user._id, token);

      toast.success(`Deleted ${user.name}`);
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
      setSelectedUser(null);
    } catch (err: any) {
      console.error('Delete failed:', err);
      toast.error(`Failed to delete ${user.name}`);
    }
  }

  useEffect(() => {
    async function fetchEverything() {
      try {
        const token = await getAccessTokenSilently();

        const [usersRes, accountsRes, transactionsRes] = await Promise.all([
          getAllUsers(token),
          getAllAccounts(token),
          getAdminTransactions(token),
        ]);

        setUsers(usersRes.data);
        setAccounts(accountsRes.data);
        setTransactions(transactionsRes.data);
      } catch (err) {
        console.error('Error fetching initial data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchEverything();
  }, [getAccessTokenSilently]);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="space-y-4">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <SkeletonRow key={i} />
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <AdminUsersDataTable
        users={users}
        onUserClick={(user) => setSelectedUser(user as UserResponse)}
      />

      {selectedUser && (
        <UserSidebar
          user={selectedUser}
          open={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          onDelete={() => handleUserDelete(selectedUser)}
          accounts={accounts.filter((acc) => acc.userId === selectedUser._id)}
          transactions={transactions
            .filter((tx) =>
              accounts.some(
                (acc) =>
                  (acc.userId === selectedUser._id && acc._id === tx.fromAccountId) ||
                  (acc.userId === selectedUser._id && acc._id === tx.toAccountId),
              ),
            )
            .slice(0, 50)}
        />
      )}
    </div>
  );
}

export default Users;
