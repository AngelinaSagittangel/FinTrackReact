export type TransactionType = {
  id: string;
  amount: number;
  categoryId: string;
  type: "income" | "expense" | "transfer";
  walletId: string;
  walletIdTo?: string;
  color: string;
  date: string;
  userId: string;
};
