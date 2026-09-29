import type { TransactionType } from "../types/TransactionType";
import type { WalletType } from "../types/WalletType";
import { getTotalAmountWallets } from "./waletts";

export function getExpenses(transactions: TransactionType[]) {
  return transactions.filter((item) => item.type === "expense");
}
// Все операции с типом расходы

export function getIncomes(transactions: TransactionType[]) {
  return transactions.filter((item) => item.type === "income");
}
// Все операции с типом доходы

export function getExpensesByCategory(expenses: TransactionType[]) {
  return expenses.reduce(
    (
      acc: {
        [categoryId: string]: {
          amount: number;
          color: string;
        };
      },
      item,
    ) => {
      if (item.categoryId in acc) {
        acc[item.categoryId].amount = acc[item.categoryId].amount + item.amount;
      } else {
        acc[item.categoryId] = {
          amount: item.amount,
          color: item.color,
        };
      }

      return acc;
    },
    {},
  );
}
// Общая сумма каждой категории расходов

export function getTotalIncome(transactions: TransactionType[]) {
  const incomes = getIncomes(transactions);

  return incomes.reduce((acc, item) => acc + item.amount, 0);
}
// Сумма общего дохода

export function getTotalExpenses(transactions: TransactionType[]) {
  const expenses = getExpenses(transactions);

  return expenses.reduce((acc, item) => acc + item.amount, 0);
}

export function getTotalBalance(
  transactions: TransactionType[],
  wallets: WalletType[],
) {
  return getTotalAmountWallets(transactions, wallets);
}

export function getAmountForMonth(
  month: string,
  transactions: TransactionType[],
) {
  const collection = new Map();

  let balance = 0;

  const sortedTransactions = [...transactions].sort((item, itm) =>
    item.date.localeCompare(itm.date),
  );

  const startDate = `${month}-01`;

  for (let i = 0; i < sortedTransactions.length; i++) {
    const transaction = sortedTransactions[i];

    if (transaction.date < startDate) {
      if (transaction.type === "expense") {
        balance -= transaction.amount;
      } else if (transaction.type === "income") {
        balance += transaction.amount;
      }
    } else if (transaction.date.slice(0, -3) === month) {
      if (transaction.type === "expense") {
        balance -= transaction.amount;
      } else if (transaction.type === "income") {
        balance += transaction.amount;
      }

      collection.set(transaction.date, balance);
    }
  }

  return Array.from(collection.entries(), ([date, balance]) => ({
    date,
    balance,
  }));
}

export function getSpentByCategory(
  categoryId: string,
  month: string,
  transactions: TransactionType[],
) {
  return transactions
    .filter(
      (item) =>
        item.type === "expense" &&
        item.categoryId === categoryId &&
        item.date.slice(0, 7) === month,
    )
    .reduce((total, item) => total + item.amount, 0);
}
