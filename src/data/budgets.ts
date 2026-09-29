import type { BudgetType } from "../types/BudgetType";
import type { TransactionType } from "../types/TransactionType";
import { getSpentByCategory } from "./transactions";

export function getBudgetStatistics(
  budgets: BudgetType[],
  transactions: TransactionType[],
) {
  return budgets.map((budget) => {
    const spent = getSpentByCategory(
      budget.categoryId,
      budget.month,
      transactions,
    );

    const remaining = budget.amount - spent;

    const percent = budget.amount === 0 ? 0 : (spent / budget.amount) * 100;

    return {
      ...budget,
      spent,
      remaining,
      percent,
    };
  });
}
