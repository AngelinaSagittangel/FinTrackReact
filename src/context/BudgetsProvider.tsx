import { useState, type ReactNode } from "react";

import { BudgetsContext } from "./BudgetsContext";
import type { BudgetType } from "../types/BudgetType";
import { useAuth } from "../hooks/useAuth";

function BudgetsProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();

  const [allBudgets, setAllBudgets] = useState<BudgetType[]>(() => {
    const savedBudgets = localStorage.getItem("budgets");

    return savedBudgets ? (JSON.parse(savedBudgets) as BudgetType[]) : [];
  });

  const budgets = currentUser
    ? allBudgets.filter((budget) => budget.userId === currentUser.id)
    : [];

  const setBudgets = (userBudgets: BudgetType[], userId?: string) => {
    const targetUserId = userId ?? currentUser?.id;

    if (!targetUserId) {
      return;
    }

    const otherUsersBudgets = allBudgets.filter(
      (budget) => budget.userId !== targetUserId,
    );

    const updatedBudgets = [...otherUsersBudgets, ...userBudgets];

    setAllBudgets(updatedBudgets);

    localStorage.setItem("budgets", JSON.stringify(updatedBudgets));
  };

  return (
    <BudgetsContext.Provider value={{ budgets, setBudgets }}>
      {children}
    </BudgetsContext.Provider>
  );
}

export default BudgetsProvider;
