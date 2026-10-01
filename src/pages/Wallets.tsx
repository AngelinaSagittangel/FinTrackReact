import "./Wallets.scss";
import { useState } from "react";

import WalletCard from "../components/wallet-card/WalletCard";
import WalletForm from "../components/wallet-form/WalletForm";

import { getAmountWallet, getTotalAmountWallets } from "../data/waletts";
import useTransactions from "../hooks/useTransactions";
import useTransfers from "../hooks/useTransfers";
import useWallets from "../hooks/useWallets";

import { formatNumber } from "../utils/formatMoney";

function Wallets() {
  const { wallets, addWallet, editWallet, removeWallet } = useWallets();
  const { transactions } = useTransactions();
  const { transfers } = useTransfers();

  const walletsWithAmount = getAmountWallet(transactions, wallets, transfers);

  const totalAmount = getTotalAmountWallets(transactions, wallets, transfers);

  const [isAddingWallet, setIsAddingWallet] = useState(false);
  const [editingWalletId, setEditingWalletId] = useState<string | null>(null);

  const editingWallet = wallets.find((item) => editingWalletId === item.id);

  async function deleteWallet(id: string) {
    const walletHasTransactions = transactions.some(
      (transaction) =>
        transaction.walletId === id || transaction.walletIdTo === id,
    );

    const walletHasTransfers = transfers.some(
      (transfer) => transfer.fromWalletId === id || transfer.toWalletId === id,
    );

    if (walletHasTransactions || walletHasTransfers) {
      alert("Нельзя удалить кошелёк, пока у него есть операции.");
      return;
    }

    await removeWallet(id);
  }

  return (
    <section className="wallets">
      {isAddingWallet || editingWalletId !== null ? (
        <WalletForm
          onSubmit={async (newWallet) => {
            if (editingWalletId) {
              await editWallet(newWallet);
            } else {
              await addWallet(newWallet);
            }

            setIsAddingWallet(false);
            setEditingWalletId(null);
          }}
          editingWallet={editingWallet}
          currentAmount={
            editingWallet
              ? walletsWithAmount.find(
                  (wallet) => wallet.id === editingWallet.id,
                )?.amount
              : undefined
          }
        />
      ) : (
        <div className="wallets__main">
          <header className="wallets__header">Ваши кошельки</header>

          <div className="wallets__content">
            <div className="wallets__top">
              <div className="wallets__total">
                <span>Общий баланс</span>
                <strong>{formatNumber(totalAmount)}</strong>
              </div>

              <button
                className="wallets__add"
                onClick={() => setIsAddingWallet(true)}
              >
                Добавить
              </button>
            </div>

            <div className="wallets__list">
              {walletsWithAmount.map((wallet) => (
                <WalletCard
                  key={wallet.id}
                  {...wallet}
                  onDelete={deleteWallet}
                  onEdit={(id) => setEditingWalletId(id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Wallets;
