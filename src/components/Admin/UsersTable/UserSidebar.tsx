'use client';

import type { AccountResponse } from '@/types/account';
import type { TransactionResponse } from '@/types/transaction';
import type { UserResponse } from '@/types/user';
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

interface Props {
  user: UserResponse;
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  accounts: AccountResponse[];
  transactions: TransactionResponse[];
}

export default function UserSidebar({
  user,
  open,
  onClose,
  onDelete,
  accounts,
  transactions,
}: Props) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

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
              {accounts.length ? (
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
              {transactions.length ? (
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
