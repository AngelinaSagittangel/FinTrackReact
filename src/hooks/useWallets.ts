import { useContext } from "react";
import { WalletContext } from "../context/WalletsContext";

function useWallets() {
  const context = useContext(WalletContext);

  if (context === null) {
    throw new Error("useWallets must be used within WalletsProvider");
  }

  return context;
}

export default useWallets;
