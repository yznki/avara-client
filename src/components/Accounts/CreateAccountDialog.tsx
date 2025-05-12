import { useState } from 'react';
import { useUserContext } from '@/context/UserContext';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const ACCOUNT_TYPES = ['checking', 'savings', 'investment'] as const;

export function CreateAccountDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) {
  const { getAccessTokenSilently } = useAuth0();
  const { accounts, refetchAccountsAndTransactions } = useUserContext();
  const [loadingType, setLoadingType] = useState<string | null>(null); // track which button is loading

  const existingTypes = accounts.map((acc) => acc.accountType);
  const availableTypes = ACCOUNT_TYPES.filter((type) => !existingTypes.includes(type));

  const createAccount = async (type: string) => {
    setLoadingType(type);
    try {
      const token = await getAccessTokenSilently();
      await api.post(
        '/accounts',
        { accountType: type },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      await refetchAccountsAndTransactions();
      toast.success(`Successfully created ${type} account`);
      setIsOpen(false);
    } catch (err) {
      toast.error('Failed to create account');
      console.error(err);
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Account Type</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          {availableTypes.map((type) => (
            <Button
              key={type}
              onClick={() => createAccount(type)}
              disabled={loadingType !== null}
              className="capitalize"
            >
              {loadingType === type ? 'Creating...' : `Create ${type} account`}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
