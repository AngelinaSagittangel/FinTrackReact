import { useState, type ReactNode } from "react";
import { TransactionsContext } from "./TransactionsContext";
import type { TransactionType } from "../types/TransactionType";
import { useAuth } from "../hooks/useAuth";

function TransactionsProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();

  const [allTransactions, setAllTransactions] = useState<TransactionType[]>(
    () => {
      const savedTransactions = localStorage.getItem("transactions");

      return savedTransactions
        ? (JSON.parse(savedTransactions) as TransactionType[])
        : [];
    },
  );

  const transactions = currentUser
    ? allTransactions.filter(
        (transaction) => transaction.userId === currentUser.id,
      )
    : [];

  const setTransactions = (userTransactions: TransactionType[]) => {
    if (!currentUser) {
      return;
    }

    const otherUsersTransactions = allTransactions.filter(
      (transaction) => transaction.userId !== currentUser.id,
    );

    const updatedTransactions = [
      ...otherUsersTransactions,
      ...userTransactions,
    ];

    setAllTransactions(updatedTransactions);

    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
  };

  return (
    <TransactionsContext.Provider value={{ transactions, setTransactions }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export default TransactionsProvider;
