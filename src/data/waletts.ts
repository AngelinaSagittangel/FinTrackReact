import type { TransactionType } from "../types/TransactionType";
import type { WalletType } from "../types/WalletType";

export function getTotalAmountWallets(
  transactions: TransactionType[],
  wallets: WalletType[],
) {
  return getAmountWallet(transactions, wallets).reduce(
    (acc, item) => acc + item.amount,
    0,
  );
}

export function getAmountWallet(
  transactions: TransactionType[],
  wallets: WalletType[],
) {
  return wallets.map((item) => {
    const walletTransactions = transactions.filter((transaction) => {
      return (
        transaction.walletId === item.id || transaction.walletIdTo === item.id
      );
    });

    const amount = walletTransactions.reduce((acc, itm) => {
      if (itm.type === "expense") {
        return acc - itm.amount;
      } else if (itm.type === "income") {
        return acc + itm.amount;
      } else {
        if (itm.walletId === item.id) {
          return acc - itm.amount;
        } else if (itm.walletIdTo === item.id) {
          return acc + itm.amount;
        }
      }

      return acc;
    }, item.initialAmount);

    return { ...item, amount: amount };
  });
}
