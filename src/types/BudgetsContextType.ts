import type { BudgetType } from "./BudgetType";
import type { BudgetWithStatisticsType } from "./BudgetWithStatisticsType";

export type BudgetsContextType = {
  budgets: BudgetWithStatisticsType[];
  addBudget: (budget: BudgetType) => Promise<void>;
  editBudget: (budget: BudgetType) => Promise<void>;
  removeBudget: (id: string) => Promise<void>;
};
