import { useState } from 'react';
import { useUserContext } from '@/context/UserContext';
import type { AccountResponse } from '@/types/account';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { CreateAccountDialog } from '@/components/Accounts/CreateAccountDialog';
import Overview from '@/components/Accounts/Overview';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function Accounts() {
  const { accounts, transactions, refetchAccountsAndTransactions } = useUserContext();
  const { getAccessTokenSilently } = useAuth0();

  const [open, setOpen] = useState(false);
  const [deletingAccountId, setDeletingAccountId] = useState<string | null>(null);

  const handleDelete = async (account: AccountResponse) => {
    setDeletingAccountId(account._id);
    try {
      const token = await getAccessTokenSilently();
      await api.delete(`/accounts/${account._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`Deleted ${account.accountType} account`);
      await refetchAccountsAndTransactions();
    } catch (err: any) {
      const code = err?.response?.status;
      if (code === 400) toast.error('Cannot delete checking or no checking to transfer to');
      else if (code === 404) toast.error('Account not found');
      else if (code === 401) toast.error('Unauthorized');
      else toast.error('Failed to delete account');
      console.error(err);
    } finally {
      setDeletingAccountId(null);
    }
  };

  return (
    <div className="grid gap-16 py-4 px-1">
      {accounts.map((account, index) => (
        <div key={account._id} className="grid gap-16">
          <Overview
            account={account}
            userTransactions={transactions}
            onDelete={handleDelete}
            isDeleting={deletingAccountId === account._id}
          />
          {index < accounts.length - 1 && <Separator />}
        </div>
      ))}

      {accounts.length < 3 && (
        <div className="flex justify-center">
          <Button variant="ghost" className="text-muted-foreground" onClick={() => setOpen(true)}>
            + Create New Account
          </Button>
        </div>
      )}

      <CreateAccountDialog isOpen={open} setIsOpen={setOpen} />
    </div>
  );
}
