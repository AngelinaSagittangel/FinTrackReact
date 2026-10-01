import { useEffect, useState, type ReactNode } from "react";

import { BudgetsContext } from "./BudgetsContext";
import type { BudgetType } from "../types/BudgetType";
import type { BudgetWithStatisticsType } from "../types/BudgetWithStatisticsType";
import { useAuth } from "../hooks/useAuth";
import useTransactions from "../hooks/useTransactions";

import {
  createBudgetApi,
  deleteBudgetApi,
  getBudgetsApi,
  updateBudgetApi,
} from "../services/budgetService";

function BudgetsProvider({ children }: { children: ReactNode }) {
  const { currentUser, isAuthenticated } = useAuth();
  const { transactionsVersion } = useTransactions();

  const [budgets, setBudgetsState] = useState<BudgetWithStatisticsType[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    getBudgetsApi()
      .then((budgetsFromApi) => {

        const formattedBudgets: BudgetWithStatisticsType[] = budgetsFromApi.map(
          (budget) => ({
            id: budget.id,
            userId: budget.userId,
            categoryId: budget.categoryId,
            amount: Number(budget.amount),
            month: `${budget.year}-${String(budget.month).padStart(2, "0")}`,
            spent: Number(budget.spent),
            remaining: Number(budget.remaining),
            percent: Number(budget.percent),
          }),
        );

        setBudgetsState(formattedBudgets);
      })
      .catch((error) => {
        console.error("Не удалось загрузить бюджеты:", error);
      });
  }, [isAuthenticated, transactionsVersion]);

  async function addBudget(budget: BudgetType) {
    const [year, month] = budget.month.split("-").map(Number);

    const createdBudget = await createBudgetApi(
      budget.amount,
      month,
      year,
      budget.categoryId,
    );

    const formattedBudget: BudgetWithStatisticsType = {
      id: createdBudget.id,
      userId: createdBudget.userId,
      categoryId: createdBudget.categoryId,
      amount: Number(createdBudget.amount),
      month: `${createdBudget.year}-${String(createdBudget.month).padStart(
        2,
        "0",
      )}`,
      spent: Number(createdBudget.spent),
      remaining: Number(createdBudget.remaining),
      percent: Number(createdBudget.percent),
    };

    setBudgetsState((prevBudgets) => [...prevBudgets, formattedBudget]);
  }

  async function editBudget(budget: BudgetType) {
    const [year, month] = budget.month.split("-").map(Number);

    const updatedBudget = await updateBudgetApi(
      budget.id,
      budget.amount,
      month,
      year,
      budget.categoryId,
    );

    const formattedBudget: BudgetWithStatisticsType = {
      id: updatedBudget.id,
      userId: updatedBudget.userId,
      categoryId: updatedBudget.categoryId,
      amount: Number(updatedBudget.amount),
      month: `${updatedBudget.year}-${String(updatedBudget.month).padStart(
        2,
        "0",
      )}`,
      spent: Number(updatedBudget.spent),
      remaining: Number(updatedBudget.remaining),
      percent: Number(updatedBudget.percent),
    };

    setBudgetsState((prevBudgets) =>
      prevBudgets.map((currentBudget) =>
        currentBudget.id === budget.id ? formattedBudget : currentBudget,
      ),
    );
  }

  async function removeBudget(id: string) {
    await deleteBudgetApi(id);

    setBudgetsState((prevBudgets) =>
      prevBudgets.filter((budget) => budget.id !== id),
    );
  }

  return (
    <BudgetsContext.Provider
      value={{
        budgets: currentUser ? budgets : [],
        addBudget,
        editBudget,
        removeBudget,
      }}
    >
      {children}
    </BudgetsContext.Provider>
  );
}

export default BudgetsProvider;
