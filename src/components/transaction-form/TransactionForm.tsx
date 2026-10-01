import { useState, type SyntheticEvent } from "react";
import type { TransactionFormType } from "../../types/TransactionFormType";
import type { TransactionType } from "../../types/TransactionType";
import type { CategoryType } from "../../types/CategoryType";
import useCategories from "../../hooks/useCategories";
import useWallets from "../../hooks/useWallets";
import useTransactions from "../../hooks/useTransactions";
import "./TransactionForm.scss";
type Props = TransactionFormType & {
  transaction?: TransactionType;
  onCancel?: () => void;
};
function TransactionForm({ type, onSubmit, transaction, onCancel }: Props) {
  const { categories, addCategory, editCategory, removeCategory } =
    useCategories();
  const { wallets } = useWallets();
  const { transactions } = useTransactions();
  const [fromWallet, setFromWallet] = useState(
    transaction?.walletId ?? wallets[0]?.id ?? "",
  );
  const [toWallet, setToWallet] = useState(
    transaction?.walletIdTo ?? wallets[1]?.id ?? "",
  );
  const [amount, setAmount] = useState(
    transaction ? String(transaction.amount) : "",
  );
  const [date, setDate] = useState(transaction?.date ?? "");
  const [walletId, setWalletId] = useState(
    transaction?.walletId ?? wallets[0]?.id ?? "",
  );
  const availableCategories = categories.filter((category) => {
    if (type === "expense") {
      return category.type === "expense";
    }
    return category.type === "income";
  });
  const [categoryId, setCategoryId] = useState(
    transaction?.categoryId ?? availableCategories[0]?.id ?? "",
  );
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [editedCategory, setEditedCategory] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const handleAddCategory = async () => {
    const name = newCategory.trim();
    if (!name || type === "transfer") {
      return;
    }
    const categoryExists = categories.some(
      (item) =>
        item.name.toLowerCase() === name.toLowerCase() && item.type === type,
    );
    if (categoryExists) {
      setCategoryError("Такая категория уже существует.");
      return;
    }
    const category: CategoryType = {
      id: "",
      userId: "",
      name,
      color: "#C8AD61",
      type,
    };
    try {
      const createdCategory = await addCategory(category);
      setCategoryId(createdCategory.id);
      setNewCategory("");
      setIsAddingCategory(false);
      setCategoryError("");
    } catch (error) {
      console.error("Не удалось создать категорию:", error);
      setCategoryError("Не удалось создать категорию.");
    }
  };
  const handleEditCategory = async () => {
    const name = editedCategory.trim();
    if (!name || type === "transfer") {
      return;
    }
    const categoryExists = categories.some(
      (item) =>
        item.name.toLowerCase() === name.toLowerCase() &&
        item.type === type &&
        item.id !== categoryId,
    );
    if (categoryExists) {
      setCategoryError("Такая категория уже существует.");
      return;
    }
    const currentCategory = categories.find(
      (category) => category.id === categoryId,
    );
    if (!currentCategory) {
      return;
    }
    try {
      await editCategory({ ...currentCategory, name });
      setEditedCategory("");
      setIsEditingCategory(false);
      setCategoryError("");
    } catch (error) {
      console.error("Не удалось изменить категорию:", error);
      setCategoryError("Не удалось изменить категорию.");
    }
  };
  const handleDeleteCategory = async () => {
    if (!categoryId || type === "transfer") {
      return;
    }
    const categoryHasTransactions = transactions.some(
      (item) => item.categoryId === categoryId,
    );
    if (categoryHasTransactions) {
      setCategoryError("Нельзя удалить категорию, у которой есть операции.");
      return;
    }
    try {
      await removeCategory(categoryId);
      const nextCategory = availableCategories.find(
        (item) => item.id !== categoryId,
      );
      setCategoryId(nextCategory?.id ?? "");
      setCategoryError("");
    } catch (error) {
      console.error("Не удалось удалить категорию:", error);
      setCategoryError("Не удалось удалить категорию.");
    }
  };
  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    const numericAmount = Number(amount);
    if (numericAmount <= 0 || !date) {
      return;
    }
    if (type === "transfer") {
      if (wallets.length < 2) {
        return;
      }
      if (!fromWallet || !toWallet || fromWallet === toWallet) {
        return;
      }
    }
    const categoryData = categories.find((item) => item.id === categoryId);
    const updatedTransaction: TransactionType = {
      id: transaction?.id ?? crypto.randomUUID(),
      userId: "",
      type,
      categoryId: type === "transfer" ? "" : categoryId,
      date,
      walletId: type === "transfer" ? fromWallet : walletId,
      amount: numericAmount,
      color:
        type === "transfer" ? "#7189C7" : (categoryData?.color ?? "#7189C7"),
    };
    if (type === "transfer") {
      updatedTransaction.walletIdTo = toWallet;
    }
    onSubmit(updatedTransaction);
  };
  const canCreateTransfer = wallets.length >= 2;
  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      {" "}
      <input
        type="number"
        placeholder="Сумма"
        min="0.01"
        step="0.01"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        required
      />{" "}
      <input
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        required
      />{" "}
      {type === "income" || type === "expense" ? (
        <div className="transaction-form__selects">
          {" "}
          <select
            value={walletId}
            onChange={(event) => setWalletId(event.target.value)}
          >
            {" "}
            {wallets.map((item) => (
              <option key={item.id} value={item.id}>
                {" "}
                {item.name}{" "}
              </option>
            ))}{" "}
          </select>{" "}
          <div className="transaction-form__category">
            {" "}
            <select
              value={categoryId}
              onChange={(event) => {
                setCategoryId(event.target.value);
                setCategoryError("");
              }}
            >
              {" "}
              {availableCategories.map((item) => (
                <option key={item.id} value={item.id}>
                  {" "}
                  {item.name}{" "}
                </option>
              ))}{" "}
            </select>{" "}
            <button
              type="button"
              onClick={() => {
                const currentCategory = categories.find(
                  (item) => item.id === categoryId,
                );
                setIsEditingCategory(true);
                setEditedCategory(currentCategory?.name ?? "");
                setIsAddingCategory(false);
                setCategoryError("");
              }}
            >
              {" "}
              Изменить{" "}
            </button>{" "}
            <button type="button" onClick={handleDeleteCategory}>
              {" "}
              Удалить{" "}
            </button>{" "}
            <button
              type="button"
              onClick={() => {
                setIsAddingCategory(true);
                setIsEditingCategory(false);
                setCategoryError("");
              }}
            >
              {" "}
              + Новая{" "}
            </button>{" "}
          </div>{" "}
          {categoryError && (
            <span className="transaction-form__error">{categoryError}</span>
          )}{" "}
          {isAddingCategory && (
            <div className="transaction-form__new-category">
              {" "}
              <input
                type="text"
                placeholder="Название категории"
                value={newCategory}
                onChange={(event) => setNewCategory(event.target.value)}
              />{" "}
              <button type="button" onClick={handleAddCategory}>
                {" "}
                Добавить{" "}
              </button>{" "}
              <button
                type="button"
                onClick={() => {
                  setIsAddingCategory(false);
                  setNewCategory("");
                }}
              >
                {" "}
                Отмена{" "}
              </button>{" "}
            </div>
          )}{" "}
          {isEditingCategory && (
            <div className="transaction-form__new-category">
              {" "}
              <input
                type="text"
                placeholder="Название категории"
                value={editedCategory}
                onChange={(event) => setEditedCategory(event.target.value)}
              />{" "}
              <button type="button" onClick={handleEditCategory}>
                {" "}
                Сохранить{" "}
              </button>{" "}
              <button
                type="button"
                onClick={() => {
                  setIsEditingCategory(false);
                  setEditedCategory("");
                }}
              >
                {" "}
                Отмена{" "}
              </button>{" "}
            </div>
          )}{" "}
        </div>
      ) : type === "transfer" ? (
        <>
          {" "}
          {canCreateTransfer ? (
            <div className="transaction-form__selects">
              {" "}
              <select
                value={fromWallet}
                disabled={Boolean(transaction)}
                onChange={(event) => {
                  const newFromWallet = event.target.value;
                  setFromWallet(newFromWallet);
                  if (newFromWallet === toWallet) {
                    const nextWallet = wallets.find(
                      (wallet) => wallet.id !== newFromWallet,
                    );
                    setToWallet(nextWallet?.id ?? "");
                  }
                }}
              >
                {" "}
                {wallets.map((item) => (
                  <option key={item.id} value={item.id}>
                    {" "}
                    {item.name}{" "}
                  </option>
                ))}{" "}
              </select>{" "}
              <select
                value={toWallet}
                disabled={Boolean(transaction)}
                onChange={(event) => setToWallet(event.target.value)}
              >
                {" "}
                {wallets
                  .filter((wallet) => wallet.id !== fromWallet)
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {" "}
                      {item.name}{" "}
                    </option>
                  ))}{" "}
              </select>{" "}
            </div>
          ) : (
            <span className="transaction-form__error">
              {" "}
              Для перевода необходимо минимум два кошелька.{" "}
            </span>
          )}{" "}
        </>
      ) : null}{" "}
      {type !== "transfer" || canCreateTransfer ? (
        <button className="transaction-form__button" type="submit">
          {" "}
          {transaction ? "Сохранить" : "Создать"}{" "}
        </button>
      ) : null}{" "}
      {transaction && onCancel && (
        <button
          className="transaction-form__cancel"
          type="button"
          onClick={onCancel}
        >
          {" "}
          Отмена{" "}
        </button>
      )}{" "}
    </form>
  );
}
export default TransactionForm;
