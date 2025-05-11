import { createContext, useContext, useEffect, useState } from 'react';
import type { AccountResponse } from '@/types/account';
import type { TransactionResponse } from '@/types/transaction';
import type { UserResponse } from '@/types/user';
import { useAuth0 } from '@auth0/auth0-react';
import { api } from '@/lib/api';

interface UserContextType {
  user: UserResponse;
  accounts: AccountResponse[];
  transactions: TransactionResponse[];
  isAuthLoading: boolean;
  isBackendLoading: boolean;
  reset: () => void;
  isLoggedOut: boolean;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUserContext must be used within UserProvider');
  return ctx;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();
  const [user, setUser] = useState<UserResponse>({} as UserResponse);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [isAuthenticated, isLoading]);

  const fetchUserData = async () => {
    if (isLoading) return;

    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const MAX_RETRIES = 5;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const token = await getAccessTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };

        const [userRes, accRes, txRes] = await Promise.all([
          api.get('/api/user/me', { headers }),
          api.get('/api/accounts', { headers }),
          api.get('/api/transactions', { headers }),
        ]);

        setUser(userRes.data);
        setAccounts(accRes.data);
        setTransactions(txRes.data);
        setLoading(false);
        setIsLoggedOut(false);
        return;
      } catch (err: any) {
        console.error(`Fetch attempt ${attempt} failed.`, err);

        const isFinal = attempt === MAX_RETRIES;
        const shouldReset = isFinal || [401, 403].includes(err?.response?.status);

        if (shouldReset) {
          console.warn('Giving up. Resetting state.');
          reset();
          return;
        }
      }
    }
  };

  const reset = () => {
    setUser({} as UserResponse);
    setAccounts([]);
    setTransactions([]);
    setIsLoggedOut(true);
    setLoading(false);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        accounts,
        transactions,
        isBackendLoading: loading,
        isAuthLoading: isLoading,
        reset,
        isLoggedOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
