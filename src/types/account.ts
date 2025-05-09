export enum EAccountType {
  Checking = 'checking',
  Savings = 'savings',
  Investment = 'investment',
}

export interface AccountResponse {
  _id: string;
  userId: string;
  type: EAccountType;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

export function getAccountName(accountType: string | EAccountType): string {
  if (typeof accountType === 'string') {
    accountType = accountType.toLowerCase() as EAccountType;
  }

  switch (accountType) {
    case EAccountType.Checking:
      return 'Checking';
    case EAccountType.Savings:
      return 'Savings';
    case EAccountType.Investment:
      return 'Investment';
    default:
      return 'Unknown Account Type';
  }
}
