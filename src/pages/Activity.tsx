import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ActionButton from "../components/action-button/ActionButton";
import TransactionForm from "../components/transaction-form/TransactionForm";
import "./Activity.scss";
import useTransactions from "../hooks/useTransactions";
import useCategories from "../hooks/useCategories";
import { formatNumber } from "../utils/formatMoney";
import type { TransactionType } from "../types/TransactionType";
import { useAuth } from "../hooks/useAuth";

const ITEMS_PER_PAGE = 10;

function Activity() {
  const location = useLocation();
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const type = location.state?.type;
  const [operationType, setOperationType] = useState(type);

  const { transactions, setTransactions } = useTransactions();
  const { categories } = useCategories();

  const [editingTransaction, setEditingTransaction] =
    useState<TransactionType | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  const sortedTransactions = [...transactions].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  const totalPages = Math.ceil(sortedTransactions.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const currentTransactions = sortedTransactions.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter(
      (transaction) => transaction.id !== id,
    );

    setTransactions(updatedTransactions);

    const updatedTotalPages = Math.ceil(
      updatedTransactions.length / ITEMS_PER_PAGE,
    );

    if (updatedTotalPages === 0) {
      setCurrentPage(1);
    } else if (currentPage > updatedTotalPages) {
      setCurrentPage(updatedTotalPages);
    }
  };

  const handleEditTransaction = (transaction: TransactionType) => {
    setEditingTransaction(transaction);
    setOperationType(transaction.type);
  };

  const handleUpdateTransaction = (updatedTransaction: TransactionType) => {
    setTransactions(
      transactions.map((transaction) =>
        transaction.id === updatedTransaction.id
          ? updatedTransaction
          : transaction,
      ),
    );

    setEditingTransaction(null);
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  return (
    <div className="activity">
      <header className="activity__header">
        {editingTransaction
          ? "Редактировать операцию"
          : operationType === "income"
            ? "Добавить доход"
            : operationType === "expense"
              ? "Добавить расход"
              : operationType === "transfer"
                ? "Добавить трансфер"
                : "Выберите операцию"}
      </header>

      <div className="activity__content">
        <div>
          {operationType === undefined ? (
            <div className="activity__actions">
              <ActionButton
                type="income"
                onClick={() => setOperationType("income")}
              />

              <ActionButton
                type="expense"
                onClick={() => setOperationType("expense")}
              />

              <ActionButton
                type="transfer"
                onClick={() => setOperationType("transfer")}
              />
            </div>
          ) : (
            <TransactionForm
              key={editingTransaction?.id ?? "new"}
              type={operationType}
              transaction={editingTransaction ?? undefined}
              onSubmit={
                editingTransaction
                  ? handleUpdateTransaction
                  : (transaction) => {
                      if (!currentUser) {
                        return;
                      }

                      setTransactions([...transactions, transaction]);

                      navigate("/");
                    }
              }
              onCancel={editingTransaction ? handleCancelEdit : undefined}
            />
          )}
        </div>

        <div className="activity__list">
          <h2>История операций</h2>

          {transactions.length === 0 ? (
            <p>Операций пока нет</p>
          ) : (
            <>
              {currentTransactions.map((transaction) => {
                const category = categories.find(
                  (item) => item.id === transaction.categoryId,
                );

                return (
                  <article className="activity__item" key={transaction.id}>
                    <div>
                      <strong>
                        {transaction.type === "transfer"
                          ? "Перевод"
                          : (category?.name ?? "Неизвестная категория")}
                      </strong>

                      <span>{transaction.date}</span>
                    </div>

                    <strong>
                      {transaction.type === "expense"
                        ? "-"
                        : transaction.type === "income"
                          ? "+"
                          : ""}
                      {formatNumber(transaction.amount)}
                    </strong>

                    <div className="activity__item-actions">
                      <button
                        type="button"
                        onClick={() => handleEditTransaction(transaction)}
                      >
                        Изменить
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                      >
                        Удалить
                      </button>
                    </div>
                  </article>
                );
              })}

              {totalPages > 1 && (
                <div className="activity__pagination">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((page) => page - 1)}
                  >
                    ←
                  </button>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1,
                  ).map((page) => (
                    <button
                      type="button"
                      key={page}
                      className={
                        page === currentPage
                          ? "activity__pagination-button--active"
                          : ""
                      }
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((page) => page + 1)}
                  >
                    →
                  </button>
                </div>
              )}

              {totalPages > 1 && (
                <div className="activity__pagination-info">
                  Показано {startIndex + 1}–
                  {Math.min(
                    startIndex + ITEMS_PER_PAGE,
                    sortedTransactions.length,
                  )}
                  из {sortedTransactions.length}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Activity;
