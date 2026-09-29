import { createContext } from "react";
import type { UserType } from "../types/user";

export type AuthContextType = {
  currentUser: UserType | null;
  isAuthenticated: boolean;
  login: (userId: string) => void;
  register: (user: UserType) => void;
  logout: () => void;
  updateUser: (user: UserType) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
