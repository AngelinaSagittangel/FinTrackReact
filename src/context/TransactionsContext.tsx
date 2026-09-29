import { createContext } from "react";
import type { TransactionsContextType } from "../types/TransactionsContextType";

export const TransactionsContext =
  createContext<TransactionsContextType | null>(null);
