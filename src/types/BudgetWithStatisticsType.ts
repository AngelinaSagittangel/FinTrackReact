import type { BudgetType } from "./BudgetType";

export type BudgetWithStatisticsType = BudgetType & {
  spent: number;
  remaining: number;
  percent: number;
};
