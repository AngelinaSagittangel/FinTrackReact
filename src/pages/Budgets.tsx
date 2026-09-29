import { useState, type SyntheticEvent } from "react";
import "./Budgets.scss";
import { getBudgetStatistics } from "../data/budgets";
import useBudgets from "../hooks/useBudgets";
import useTransactions from "../hooks/useTransactions";
import useCategories from "../hooks/useCategories";
import { formatNumber } from "../utils/formatMoney";
import { useAuth } from "../hooks/useAuth";

function Budgets() {
  const { budgets, setBudgets } = useBudgets();
  const { transactions } = useTransactions();
  const { categories } = useCategories();
  const { currentUser } = useAuth();

  const [isAddingBudget, setIsAddingBudget] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [formError, setFormError] = useState("");

  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [editingAmount, setEditingAmount] = useState("");
  const [editingMonth, setEditingMonth] = useState("");
  const [editError, setEditError] = useState("");

  const expenseCategories = categories.filter(
    (category) => category.type === "expense",
  );

  const budgetStatistics = getBudgetStatistics(budgets, transactions);

  const handleAddBudget = (event: SyntheticEvent) => {
    event.preventDefault();

    if (!currentUser || !categoryId || !amount || !month) {
      return;
    }

    const budgetExists = budgets.some(
      (budget) => budget.categoryId === categoryId && budget.month === month,
    );

    if (budgetExists) {
      setFormError(
        "Для этой категории на выбранный месяц бюджет уже существует.",
      );
      return;
    }

    const newBudget = {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      categoryId,
      amount: Number(amount),
      month,
    };

    setBudgets([...budgets, newBudget]);

    setCategoryId("");
    setAmount("");
    setMonth("");
    setFormError("");
    setIsAddingBudget(false);
  };

  const handleDeleteBudget = (id: string) => {
    setBudgets(budgets.filter((budget) => budget.id !== id));
  };

  const handleStartEdit = (id: string, amount: number, month: string) => {
    setEditingBudgetId(id);
    setEditingAmount(String(amount));
    setEditingMonth(month);
    setEditError("");
  };

  const handleCancelEdit = () => {
    setEditingBudgetId(null);
    setEditingAmount("");
    setEditingMonth("");
    setEditError("");
  };

  const handleSaveEdit = (id: string) => {
    if (!editingAmount || !editingMonth) {
      return;
    }

    const currentBudget = budgets.find((budget) => budget.id === id);

    if (!currentBudget) {
      return;
    }

    const budgetExists = budgets.some(
      (budget) =>
        budget.id !== id &&
        budget.categoryId === currentBudget.categoryId &&
        budget.month === editingMonth,
    );

    if (budgetExists) {
      setEditError(
        "Для этой категории на выбранный месяц бюджет уже существует.",
      );
      return;
    }

    const updatedBudgets = budgets.map((budget) => {
      if (budget.id === id) {
        return {
          ...budget,
          amount: Number(editingAmount),
          month: editingMonth,
        };
      }

      return budget;
    });

    setBudgets(updatedBudgets);
    handleCancelEdit();
  };

  return (
    <section className="budgets">
      <header className="budgets__header">
        <h2>Бюджеты</h2>

        <button
          className="budgets__add"
          onClick={() => {
            setIsAddingBudget(true);
            setFormError("");
          }}
        >
          + Добавить бюджет
        </button>
      </header>

      {isAddingBudget && (
        <form className="budgets__form" onSubmit={handleAddBudget}>
          <select
            value={categoryId}
            onChange={(event) => {
              setCategoryId(event.target.value);
              setFormError("");
            }}
          >
            <option value="">Выберите категорию</option>

            {expenseCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="0"
            placeholder="Лимит"
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
              setFormError("");
            }}
          />

          <input
            type="month"
            value={month}
            onChange={(event) => {
              setMonth(event.target.value);
              setFormError("");
            }}
          />

          {formError && <span className="budgets__error">{formError}</span>}

          <div className="budgets__form-actions">
            <button type="submit">Создать</button>

            <button
              type="button"
              onClick={() => {
                setIsAddingBudget(false);
                setCategoryId("");
                setAmount("");
                setMonth("");
                setFormError("");
              }}
            >
              Отмена
            </button>
          </div>
        </form>
      )}

      <div className="budgets__list">
        {budgetStatistics.length === 0 ? (
          <div className="budgets__empty">У вас пока нет бюджетов</div>
        ) : (
          budgetStatistics.map((budget) => {
            const category = categories.find(
              (item) => item.id === budget.categoryId,
            );

            const progress = Math.min(budget.percent, 100);
            const isExceeded = budget.remaining < 0;

            return (
              <article className="budget-card" key={budget.id}>
                {editingBudgetId === budget.id ? (
                  <div className="budget-card__edit">
                    <h3>{category?.name ?? "Неизвестная категория"}</h3>

                    <input
                      type="number"
                      min="0"
                      value={editingAmount}
                      onChange={(event) => {
                        setEditingAmount(event.target.value);
                        setEditError("");
                      }}
                    />

                    <input
                      type="month"
                      value={editingMonth}
                      onChange={(event) => {
                        setEditingMonth(event.target.value);
                        setEditError("");
                      }}
                    />

                    {editError && (
                      <span className="budget-card__error">{editError}</span>
                    )}

                    <div className="budget-card__actions">
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(budget.id)}
                      >
                        Сохранить
                      </button>

                      <button type="button" onClick={handleCancelEdit}>
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="budget-card__header">
                      <h3>{category?.name ?? "Неизвестная категория"}</h3>

                      <span>{formatNumber(budget.amount)}</span>
                    </div>

                    <div className="budget-card__amount">
                      <strong
                        className={isExceeded ? "budget-card__exceeded" : ""}
                      >
                        {formatNumber(budget.spent)}
                      </strong>

                      <span>из {formatNumber(budget.amount)}</span>
                    </div>

                    <div className="budget-card__progress">
                      <div
                        className={`budget-card__progress-bar ${
                          isExceeded
                            ? "budget-card__progress-bar--exceeded"
                            : ""
                        }`}
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>

                    <div className="budget-card__footer">
                      <span
                        className={isExceeded ? "budget-card__exceeded" : ""}
                      >
                        {Math.round(budget.percent)}%
                      </span>

                      <span
                        className={isExceeded ? "budget-card__exceeded" : ""}
                      >
                        {budget.remaining >= 0
                          ? `Осталось ${formatNumber(budget.remaining)}`
                          : `Превышение ${formatNumber(
                              Math.abs(budget.remaining),
                            )}`}
                      </span>
                    </div>

                    <div className="budget-card__actions">
                      <button
                        type="button"
                        onClick={() =>
                          handleStartEdit(
                            budget.id,
                            budget.amount,
                            budget.month,
                          )
                        }
                      >
                        Изменить
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteBudget(budget.id)}
                      >
                        Удалить
                      </button>
                    </div>
                  </>
                )}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

export default Budgets;
