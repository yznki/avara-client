import { type TransactionResponse } from '@/types/transaction';

export function filterTransactionsByRange(
  transactions: TransactionResponse[],
  range: '30D' | '6M' | '1Y',
) {
  const now = new Date();
  const cutoff = new Date(
    range === '30D'
      ? now.setDate(now.getDate() - 30)
      : range === '6M'
        ? now.setMonth(now.getMonth() - 6)
        : now.setFullYear(now.getFullYear() - 1),
  );

  return transactions.filter((tx) => new Date(tx.createdAt) >= cutoff);
}
