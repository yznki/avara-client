export type AccountType = 'checking' | 'savings' | 'investment';

export interface AccountResponse {
  _id: string;
  userId: string;
  accountType: AccountType;
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
