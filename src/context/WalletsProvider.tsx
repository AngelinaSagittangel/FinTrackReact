import { useEffect, useState, type ReactNode } from "react";

import { WalletContext } from "./WalletsContext";
import type { WalletType } from "../types/WalletType";
import { useAuth } from "../hooks/useAuth";

import {
  createWalletApi,
  deleteWalletApi,
  getWalletsApi,
  updateWalletApi,
} from "../services/walletService";

function WalletsProvider({ children }: { children: ReactNode }) {
  const { currentUser, isAuthenticated } = useAuth();

  const [wallets, setWallets] = useState<WalletType[]>([]);

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      return;
    }

    getWalletsApi()
      .then((walletsFromApi) => {
        const formattedWallets = walletsFromApi.map((wallet) => ({
          id: wallet.id,
          name: wallet.name,
          type: wallet.type,
          initialAmount: Number(wallet.initialBalance),
          userId: wallet.userId,
        }));

        setWallets(formattedWallets);
      })
      .catch((error) => {
        console.error("Не удалось загрузить кошельки:", error);
      });
  }, [isAuthenticated, currentUser]);

  async function addWallet(wallet: WalletType) {
    const createdWallet = await createWalletApi(
      wallet.name,
      wallet.type,
      wallet.initialAmount,
    );

    setWallets((prevWallets) => [
      ...prevWallets,
      {
        id: createdWallet.id,
        name: createdWallet.name,
        type: createdWallet.type,
        initialAmount: Number(createdWallet.initialBalance),
        userId: createdWallet.userId,
      },
    ]);
  }

  async function editWallet(wallet: WalletType) {
    const updatedWallet = await updateWalletApi(
      wallet.id,
      wallet.name,
      wallet.type,
      wallet.initialAmount,
    );

    setWallets((prevWallets) =>
      prevWallets.map((currentWallet) =>
        currentWallet.id === wallet.id
          ? {
              id: updatedWallet.id,
              name: updatedWallet.name,
              type: updatedWallet.type,
              initialAmount: Number(updatedWallet.initialBalance),
              userId: updatedWallet.userId,
            }
          : currentWallet,
      ),
    );
  }

  async function removeWallet(id: string) {
    await deleteWalletApi(id);

    setWallets((prevWallets) =>
      prevWallets.filter((wallet) => wallet.id !== id),
    );
  }

  return (
    <WalletContext.Provider
      value={{
        wallets,
        addWallet,
        editWallet,
        removeWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export default WalletsProvider;
