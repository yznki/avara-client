export type TransactionType = 'deposit' | 'withdrawal' | 'internal_transfer' | 'external_transfer';

export interface TransactionResponse {
  _id: string;
  fromAccountId: string | null;
  toAccountId: string | null;
  amount: number;
  type: TransactionType;
  note?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
