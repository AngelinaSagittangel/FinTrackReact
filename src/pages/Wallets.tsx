import "./Wallets.scss";
import { useState } from "react";
import WalletCard from "../components/wallet-card/WalletCard";
import { getAmountWallet, getTotalAmountWallets } from "../data/waletts";
import useTransactions from "../hooks/useTransactions";
import useWallets from "../hooks/useWallets";
import WalletForm from "../components/wallet-form/WalletForm";
import { formatNumber } from "../utils/formatMoney";

function Wallets() {
  const { wallets, setWallets } = useWallets();
  const { transactions } = useTransactions();

  const walletsWithAmount = getAmountWallet(transactions, wallets);

  const totalAmount = getTotalAmountWallets(transactions, wallets);

  const [isAddingWallet, setIsAddingWallet] = useState(false);

  const [editingWalletId, setEditingWalletId] = useState<string | null>(null);

  const editingWallet = wallets.find((item) => editingWalletId === item.id);

  function deleteWallet(id: string) {
    const walletHasTransactions = transactions.some(
      (transaction) =>
        transaction.walletId === id || transaction.walletIdTo === id,
    );

    if (walletHasTransactions) {
      alert("Нельзя удалить кошелёк, пока у него есть операции.");
      return;
    }

    const currentWallets = wallets.filter((item) => item.id !== id);

    setWallets(currentWallets);
  }

  return (
    <section className="wallets">
      {isAddingWallet || editingWalletId !== null ? (
        <WalletForm
          onSubmit={(newWallet) => {
            setWallets(
              editingWalletId
                ? wallets.map((item) => {
                    if (item.id === newWallet.id) {
                      return newWallet;
                    }

                    return item;
                  })
                : [...wallets, newWallet],
            );

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
