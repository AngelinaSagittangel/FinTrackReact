import { createContext } from "react";
import type { CategoriesContextType } from "../types/CategoriesContextType";

export const CategoriesContext = createContext<CategoriesContextType | null>(
  null,
);
