import { apiRequest } from "./api";

type WalletApiResponse = {
  id: string;
  name: string;
  type: "cash" | "card" | "savings" | "investment";
  initialBalance: string | number;
  userId: string;
  createdAt: string;
};

export async function getWalletsApi() {
  return apiRequest<WalletApiResponse[]>("/wallets");
}

export async function createWalletApi(
  name: string,
  type: WalletApiResponse["type"],
  initialBalance: number,
) {
  return apiRequest<WalletApiResponse>("/wallets", {
    method: "POST",
    body: JSON.stringify({
      name,
      type,
      initialBalance,
    }),
  });
}

export async function updateWalletApi(
  id: string,
  name: string,
  type: WalletApiResponse["type"],
  initialBalance: number,
) {
  return apiRequest<WalletApiResponse>(`/wallets/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      name,
      type,
      initialBalance,
    }),
  });
}

export async function deleteWalletApi(id: string) {
  return apiRequest<void>(`/wallets/${id}`, {
    method: "DELETE",
  });
}
