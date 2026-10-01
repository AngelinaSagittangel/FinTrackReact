import { createContext } from "react";
import type { TransferType } from "../types/TransferType";

export type TransfersContextType = {
  transfers: TransferType[];
  addTransfer: (transfer: TransferType) => Promise<void>;
  editTransfer: (transfer: TransferType) => Promise<void>;
  removeTransfer: (id: string) => Promise<void>;
};

export const TransfersContext = createContext<TransfersContextType | undefined>(
  undefined,
);
