import { apiRequest } from "./api";

type TransferApiResponse = {
  id: string;
  amount: string | number;
  date: string;
  createdAt: string;
  fromWalletId: string;
  toWalletId: string;
  fromWallet: {
    id: string;
    name: string;
    type: "cash" | "card" | "savings" | "investment";
    initialBalance: string | number;
    userId: string;
    createdAt: string;
  };
  toWallet: {
    id: string;
    name: string;
    type: "cash" | "card" | "savings" | "investment";
    initialBalance: string | number;
    userId: string;
    createdAt: string;
  };
};

export async function getTransfersApi() {
  return apiRequest<TransferApiResponse[]>("/transfers");
}

export async function createTransferApi(
  amount: number,
  date: string,
  fromWalletId: string,
  toWalletId: string,
) {
  return apiRequest<TransferApiResponse>("/transfers", {
    method: "POST",
    body: JSON.stringify({
      amount,
      date,
      fromWalletId,
      toWalletId,
    }),
  });
}

export async function updateTransferApi(
  id: string,
  amount: number,
  date: string,
) {
  return apiRequest<TransferApiResponse>(`/transfers/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      amount,
      date,
    }),
  });
}

export async function deleteTransferApi(id: string) {
  return apiRequest<void>(`/transfers/${id}`, {
    method: "DELETE",
  });
}
