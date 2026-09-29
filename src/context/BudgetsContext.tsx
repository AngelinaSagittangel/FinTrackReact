import { createContext } from "react";
import type { BudgetsContextType } from "../types/BudgetsContextType";

export const BudgetsContext = createContext<BudgetsContextType | null>(null);
