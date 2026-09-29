import type { WalletType } from "./WalletType";

export type WalletFormType = {
  onSubmit: (data: WalletType) => void;
  editingWallet?: WalletType;
  currentAmount?: number;
};
