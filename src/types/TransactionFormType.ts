import type { TransactionType } from "./TransactionType";

export type TransactionFormType = {
  type: "income" | "expense" | "transfer";
  onSubmit: (data: TransactionType) => void;
};
