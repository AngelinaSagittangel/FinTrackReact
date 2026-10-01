import { useEffect, useState, type ReactNode } from "react";

import { TransactionsContext } from "./TransactionsContext";
import type { TransactionType } from "../types/TransactionType";
import { useAuth } from "../hooks/useAuth";

import {
  createTransactionApi,
  deleteTransactionApi,
  getTransactionsApi,
  updateTransactionApi,
} from "../services/transactionService";

function TransactionsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [transactionsVersion, setTransactionsVersion] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    getTransactionsApi()
      .then((transactionsFromApi) => {
        const formattedTransactions = transactionsFromApi.map(
          (transaction) => ({
            id: transaction.id,
            userId: transaction.wallet.userId,
            walletId: transaction.walletId,
            categoryId: transaction.categoryId,
            amount: Number(transaction.amount),
            type: transaction.type,
            date: transaction.date,
            color: transaction.category.color,
          }),
        );

        setTransactions(formattedTransactions);
      })
      .catch((error) => {
        console.error("Не удалось загрузить транзакции:", error);
      });
  }, [isAuthenticated]);

  async function addTransaction(transaction: TransactionType) {
    if (transaction.type === "transfer") {
      return;
    }

    const createdTransaction = await createTransactionApi(
      transaction.amount,
      transaction.type,
      transaction.date,
      transaction.walletId,
      transaction.categoryId,
    );

    setTransactions((prevTransactions) => [
      ...prevTransactions,
      {
        id: createdTransaction.id,
        userId: createdTransaction.wallet.userId,
        walletId: createdTransaction.walletId,
        categoryId: createdTransaction.categoryId,
        amount: Number(createdTransaction.amount),
        type: createdTransaction.type,
        date: createdTransaction.date,
        color: createdTransaction.category.color,
      },
    ]);

    setTransactionsVersion((version) => version + 1);
  }

  async function editTransaction(transaction: TransactionType) {
    if (transaction.type === "transfer") {
      return;
    }

    const updatedTransaction = await updateTransactionApi(
      transaction.id,
      transaction.amount,
      transaction.type,
      transaction.date,
      transaction.walletId,
      transaction.categoryId,
    );

    setTransactions((prevTransactions) =>
      prevTransactions.map((currentTransaction) =>
        currentTransaction.id === transaction.id
          ? {
              id: updatedTransaction.id,
              userId: updatedTransaction.wallet.userId,
              walletId: updatedTransaction.walletId,
              categoryId: updatedTransaction.categoryId,
              amount: Number(updatedTransaction.amount),
              type: updatedTransaction.type,
              date: updatedTransaction.date,
              color: updatedTransaction.category.color,
            }
          : currentTransaction,
      ),
    );

    setTransactionsVersion((version) => version + 1);
  }

  async function removeTransaction(id: string) {
    await deleteTransactionApi(id);

    setTransactions((prevTransactions) =>
      prevTransactions.filter((transaction) => transaction.id !== id),
    );

    setTransactionsVersion((version) => version + 1);
  }

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        transactionsVersion,
        addTransaction,
        editTransaction,
        removeTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

export default TransactionsProvider;
