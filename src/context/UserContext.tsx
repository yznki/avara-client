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
  isLoggedOut: boolean;
  reset: () => void;
  refetchAccountsAndTransactions: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUserContext must be used within UserProvider');
  return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();

  const [user, setUser] = useState<UserResponse>({} as UserResponse);
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [isBackendLoading, setIsBackendLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      fetchUserData();
    }
  }, [isAuthenticated, isLoading]);

  const fetchUserInfo = async (headers: Record<string, string>) => {
    const response = await api.get('/user/me', { headers });
    setUser(response.data);
  };

  const fetchAccountsAndTransactions = async (headers: Record<string, string>) => {
    const [accountsResponse, transactionsResponse] = await Promise.all([
      api.get('/accounts', { headers }),
      api.get('/transactions', { headers }),
    ]);
    setAccounts(accountsResponse.data);
    setTransactions(transactionsResponse.data);
  };

  const fetchUserData = async () => {
    if (!isAuthenticated) {
      setIsBackendLoading(false);
      return;
    }

    const maximumRetries = 5;

    for (let attempt = 1; attempt <= maximumRetries; attempt++) {
      try {
        const token = await getAccessTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };

        await Promise.all([fetchUserInfo(headers), fetchAccountsAndTransactions(headers)]);

        setIsBackendLoading(false);
        setIsLoggedOut(false);
        return;
      } catch (error: any) {
        const isFinalAttempt = attempt === maximumRetries;
        const isUnauthorized = [401, 403].includes(error?.response?.status);

        if (isFinalAttempt || isUnauthorized) {
          reset();
          return;
        }
      }
    }
  };

  const refetchUser = async () => {
    const token = await getAccessTokenSilently();
    const headers = { Authorization: `Bearer ${token}` };
    await fetchUserInfo(headers); // already defined
  };

  const reset = () => {
    setUser({} as UserResponse);
    setAccounts([]);
    setTransactions([]);
    setIsLoggedOut(true);
    setIsBackendLoading(false);
  };

  const refetchAccountsAndTransactions = async () => {
    const token = await getAccessTokenSilently();
    const headers = { Authorization: `Bearer ${token}` };
    await fetchAccountsAndTransactions(headers);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        accounts,
        transactions,
        isAuthLoading: isLoading,
        isBackendLoading,
        isLoggedOut,
        reset,
        refetchAccountsAndTransactions,
        refetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
