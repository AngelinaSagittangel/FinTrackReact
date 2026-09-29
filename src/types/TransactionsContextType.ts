import type { Dispatch } from "react";
import type { TransactionType } from "./TransactionType";

export type TransactionsContextType = {
  transactions: TransactionType[];
  setTransactions: Dispatch<TransactionType[]>;
};
