'use client';

import { useEffect, useState } from 'react';
import type { AccountResponse } from '@/types/account';
import type { TransactionResponse } from '@/types/transaction';
import { useAuth0 } from '@auth0/auth0-react';
import { getAdminTransactions, getAllAccounts } from '@/lib/admin';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  user: {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    profilePicture: string;
  };
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export default function UserSidebar({ user, open, onClose, onDelete }: Props) {
  const { getAccessTokenSilently } = useAuth0();

  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  useEffect(() => {
    if (!open || !user?._id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await getAccessTokenSilently();

        const [allAccountsRes, allTransactionsRes] = await Promise.all([
          getAllAccounts(token),
          getAdminTransactions(token),
        ]);

        const allAccounts: AccountResponse[] = allAccountsRes.data || [];
        const allTransactions: TransactionResponse[] = allTransactionsRes.data || [];

        const userAccounts = allAccounts.filter((a) => a.userId === user._id);
        const userAccountIds = userAccounts.map((acc) => acc._id);

        const userTransactions = allTransactions
          .filter((t) => t.fromAccountId && userAccountIds.includes(t.fromAccountId))
          .slice(0, 50);
        setAccounts(userAccounts);
        setTransactions(userTransactions);
      } catch (err) {
        console.error('Error loading user data:', err);
        setAccounts([]);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open, user._id, getAccessTokenSilently]);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md p-2">
        <div className="p-4">
          <SheetHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.profilePicture} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <SheetTitle className="text-lg">{user.name}</SheetTitle>
                <SheetDescription>{user.email}</SheetDescription>
              </div>
              <Badge variant="outline" className="ml-auto capitalize">
                {user.role}
              </Badge>
            </div>
          </SheetHeader>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)] pr-2">
          <div className="space-y-6 px-4 pb-6">
            {/* Accounts */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Accounts</h3>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-20 rounded-lg" />
                  <Skeleton className="h-20 rounded-lg" />
                </div>
              ) : accounts.length ? (
                <div className="space-y-3">
                  {accounts.map((account) => (
                    <div key={account._id} className="border rounded-lg p-4">
                      <div className="flex justify-between font-semibold">
                        <span className="capitalize">{account.accountType}</span>
                        <span className="text-primary">${account.balance.toLocaleString()}</span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Created: {new Date(account.createdAt).toLocaleString()} <br />
                        Updated: {new Date(account.updatedAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No accounts found.</p>
              )}
            </div>

            {/* Transactions */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Recent Transactions</h3>
              {loading ? (
                <div className="space-y-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-6 rounded-md" />
                    ))}
                </div>
              ) : transactions.length ? (
                <div className="text-sm space-y-1">
                  {transactions.map((tx) => (
                    <div
                      key={tx._id}
                      className="flex justify-between border-b pb-1 text-muted-foreground"
                    >
                      <span className="w-1/3">{new Date(tx.createdAt).toLocaleDateString()}</span>
                      <span className="w-1/3 text-center">{tx.type}</span>
                      <span className="w-1/3 text-right">${tx.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No transactions found.</p>
              )}
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 pt-0">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                Delete User
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete{' '}
                  <strong>{user.name}</strong> and all associated data from the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-white hover:bg-destructive/90"
                  onClick={onDelete}
                >
                  Confirm Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </SheetContent>
    </Sheet>
  );
}
