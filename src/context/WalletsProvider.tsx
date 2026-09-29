import { useState, type ReactNode } from "react";

import { WalletContext } from "./WalletsContext";
import type { WalletType } from "../types/WalletType";
import { useAuth } from "../hooks/useAuth";

function WalletsProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();

  const [allWallets, setAllWallets] = useState<WalletType[]>(() => {
    const savedWallets = localStorage.getItem("wallets");

    return savedWallets ? (JSON.parse(savedWallets) as WalletType[]) : [];
  });

  const wallets = currentUser
    ? allWallets.filter((wallet) => wallet.userId === currentUser.id)
    : [];

  const setWallets = (userWallets: WalletType[], userId?: string) => {
    const targetUserId = userId ?? currentUser?.id;

    if (!targetUserId) {
      return;
    }

    const otherUsersWallets = allWallets.filter(
      (wallet) => wallet.userId !== targetUserId,
    );

    const updatedWallets = [...otherUsersWallets, ...userWallets];

    setAllWallets(updatedWallets);

    localStorage.setItem("wallets", JSON.stringify(updatedWallets));
  };

  return (
    <WalletContext.Provider value={{ wallets, setWallets }}>
      {children}
    </WalletContext.Provider>
  );
}

export default WalletsProvider;
