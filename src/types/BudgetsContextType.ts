import type { BudgetType } from "./BudgetType";

export type BudgetsContextType = {
  budgets: BudgetType[];
  setBudgets: (budgets: BudgetType[], userId?: string) => void;
};
