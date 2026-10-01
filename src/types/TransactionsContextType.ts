import type { TransactionType } from "../types/TransactionType";

export type TransactionsContextType = {
  transactions: TransactionType[];
  transactionsVersion: number;
  addTransaction: (transaction: TransactionType) => Promise<void>;
  editTransaction: (transaction: TransactionType) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
};
