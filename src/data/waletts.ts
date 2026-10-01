import type { TransactionType } from "../types/TransactionType";
import type { TransferType } from "../types/TransferType";
import type { WalletType } from "../types/WalletType";

export function getTotalAmountWallets(
  transactions: TransactionType[],
  wallets: WalletType[],
  transfers: TransferType[] = [],
) {
  return getAmountWallet(transactions, wallets, transfers).reduce(
    (acc, item) => acc + item.amount,
    0,
  );
}

export function getAmountWallet(
  transactions: TransactionType[],
  wallets: WalletType[],
  transfers: TransferType[] = [],
) {
  return wallets.map((item) => {
    const walletTransactions = transactions.filter((transaction) => {
      return transaction.walletId === item.id;
    });

    const transactionAmount = walletTransactions.reduce((acc, transaction) => {
      if (transaction.type === "expense") {
        return acc - transaction.amount;
      }

      if (transaction.type === "income") {
        return acc + transaction.amount;
      }

      return acc;
    }, 0);

    const walletTransfers = transfers.filter((transfer) => {
      return (
        transfer.fromWalletId === item.id || transfer.toWalletId === item.id
      );
    });

    const transferAmount = walletTransfers.reduce((acc, transfer) => {
      if (transfer.fromWalletId === item.id) {
        return acc - transfer.amount;
      }

      if (transfer.toWalletId === item.id) {
        return acc + transfer.amount;
      }

      return acc;
    }, 0);

    const amount = item.initialAmount + transactionAmount + transferAmount;

    return {
      ...item,
      amount,
    };
  });
}
