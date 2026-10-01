import { apiRequest } from "./api";
import type { BudgetApiResponseType } from "../types/BudgetApiResponseType";

export async function getBudgetsApi() {
  return apiRequest<BudgetApiResponseType[]>("/budgets");
}

export async function createBudgetApi(
  amount: number,
  month: number,
  year: number,
  categoryId: string,
) {
  return apiRequest<BudgetApiResponseType>("/budgets", {
    method: "POST",
    body: JSON.stringify({
      amount,
      month,
      year,
      categoryId,
    }),
  });
}

export async function updateBudgetApi(
  id: string,
  amount: number,
  month: number,
  year: number,
  categoryId: string,
) {
  return apiRequest<BudgetApiResponseType>(`/budgets/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      amount,
      month,
      year,
      categoryId,
    }),
  });
}

export async function deleteBudgetApi(id: string) {
  return apiRequest<void>(`/budgets/${id}`, {
    method: "DELETE",
  });
}
