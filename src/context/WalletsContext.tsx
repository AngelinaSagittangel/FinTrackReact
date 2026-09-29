import { createContext } from "react";
import type { WalletsContextType } from "../types/WalletsContextType";

export const WalletContext = createContext<WalletsContextType | null>(null);
