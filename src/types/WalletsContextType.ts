import type { WalletType } from "./WalletType";

export type WalletsContextType = {
  wallets: WalletType[];

  addWallet: (wallet: WalletType) => Promise<void>;

  editWallet: (wallet: WalletType) => Promise<void>;

  removeWallet: (id: string) => Promise<void>;
};
