export type AccountType = 'checking' | 'savings' | 'investment';

export interface AccountResponse {
  _id: string;
  userId: string;
  type: AccountType;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

export function getAccountName(accountType: string | AccountType): string {
  if (typeof accountType === 'string') {
    accountType = accountType.toLowerCase() as AccountType;
  }

  switch (accountType) {
    case 'checking':
      return 'Checking';
    case 'savings':
      return 'Savings';
    case 'investment':
      return 'Investment';
    default:
      return 'Unknown Account Type';
  }
}

export const mockUserAccounts: AccountResponse[] = [
  {
    _id: '1',
    userId: 'user1',
    type: 'checking',
    balance: 5000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '2',
    userId: 'user1',
    type: 'savings',
    balance: 15000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '3',
    userId: 'user1',
    type: 'investment',
    balance: -2000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
