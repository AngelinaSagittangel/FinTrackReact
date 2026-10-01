import { apiRequest } from "./api";

type TransactionApiResponse = {
  id: string;
  amount: string | number;
  type: "income" | "expense";
  date: string;
  createdAt: string;
  walletId: string;
  categoryId: string;
  wallet: {
    id: string;
    name: string;
    type: "cash" | "card" | "savings" | "investment";
    initialBalance: string | number;
    userId: string;
    createdAt: string;
  };
  category: {
    id: string;
    name: string;
    color: string;
    type: "income" | "expense";
    userId: string;
    createdAt: string;
  };
};

export async function getTransactionsApi() {
  return apiRequest<TransactionApiResponse[]>("/transactions");
}

export async function createTransactionApi(
  amount: number,
  type: "income" | "expense",
  date: string,
  walletId: string,
  categoryId: string,
) {
  return apiRequest<TransactionApiResponse>("/transactions", {
    method: "POST",
    body: JSON.stringify({
      amount,
      type,
      date,
      walletId,
      categoryId,
    }),
  });
}

export async function updateTransactionApi(
  id: string,
  amount: number,
  type: "income" | "expense",
  date: string,
  walletId: string,
  categoryId: string,
) {
  return apiRequest<TransactionApiResponse>(`/transactions/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      amount,
      type,
      date,
      walletId,
      categoryId,
    }),
  });
}

export async function deleteTransactionApi(id: string) {
  return apiRequest<void>(`/transactions/${id}`, {
    method: "DELETE",
  });
}
