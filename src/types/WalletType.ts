export type WalletType = {
  id: string;
  name: string;
  type: "cash" | "card" | "savings" | "investment";
  initialAmount: number;
  userId: string;
};

export type WalletWithAmountType = WalletType & {
  amount: number;
};

export type WalletCardProps = WalletWithAmountType & {
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
};
