import type { WalletType } from "./WalletType";
export type WalletsContextType = {
  wallets: WalletType[];
  setWallets: (wallets: WalletType[], userId?: string) => void;
};
