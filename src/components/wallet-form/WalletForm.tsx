import "./WalletForm.scss";
import { useState, type SyntheticEvent } from "react";
import type { WalletFormType } from "../../types/WalletFormType";
import type { WalletFormDataType } from "../../types/WalletFormDataType";
import type { WalletType } from "../../types/WalletType";
import { useAuth } from "../../hooks/useAuth";
import useTransactions from "../../hooks/useTransactions";

function WalletForm({
  onSubmit,
  editingWallet,
  currentAmount,
}: WalletFormType) {
  const { currentUser } = useAuth();
  const { transactions } = useTransactions();

  const [wallet, setWallet] = useState<WalletFormDataType>(
    editingWallet
      ? {
          name: editingWallet.name,
          type: editingWallet.type,
          initialAmount: String(currentAmount ?? editingWallet.initialAmount),
        }
      : {
          name: "",
          type: "card",
          initialAmount: "",
        },
  );

  const [nameError, setNameError] = useState("");
  const [amountError, setAmountError] = useState("");

  const walletHasTransactions = editingWallet
    ? transactions.some(
        (transaction) =>
          transaction.walletId === editingWallet.id ||
          transaction.walletIdTo === editingWallet.id,
      )
    : false;

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    const name = wallet.name.trim();
    const initialAmount = Number(wallet.initialAmount);

    if (!name) {
      setNameError("Введите название кошелька");
      return;
    }

    if (wallet.initialAmount.startsWith("-")) {
      setAmountError("Сумма не может быть отрицательной");
      return;
    }

    if (!currentUser) {
      return;
    }

    const newWallet: WalletType = {
      id: editingWallet ? editingWallet.id : crypto.randomUUID(),
      userId: editingWallet ? editingWallet.userId : currentUser.id,
      name,
      type: wallet.type,
      initialAmount: walletHasTransactions
        ? editingWallet!.initialAmount
        : initialAmount,
    };

    onSubmit(newWallet);
  };

  return (
    <form className="wallet-form" onSubmit={handleSubmit}>
      <input
        placeholder="Название кошелька"
        type="text"
        value={wallet.name}
        onChange={(event) => {
          setWallet({
            ...wallet,
            name: event.target.value,
          });

          setNameError("");
        }}
      />

      {nameError && <span className="wallet-form__error">{nameError}</span>}

      <select
        value={wallet.type}
        onChange={(event) => {
          setWallet({
            ...wallet,
            type: event.target.value as WalletFormDataType["type"],
          });
        }}
      >
        <option value="cash">Наличные</option>
        <option value="card">Карта</option>
        <option value="savings">Сбережения</option>
        <option value="investment">Инвестиции</option>
      </select>

      <input
        placeholder="Сумма"
        type="number"
        min="0"
        value={wallet.initialAmount}
        disabled={walletHasTransactions}
        onChange={(event) => {
          setWallet({
            ...wallet,
            initialAmount: event.target.value,
          });

          setAmountError("");
        }}
      />

      {walletHasTransactions && (
        <span className="wallet-form__error">
          Начальную сумму нельзя изменить, если у кошелька есть операции.
        </span>
      )}

      {amountError && <span className="wallet-form__error">{amountError}</span>}

      <button className="wallet-form__button">Сохранить</button>
    </form>
  );
}

export default WalletForm;
