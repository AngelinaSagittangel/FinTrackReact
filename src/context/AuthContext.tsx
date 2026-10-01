import { createContext } from "react";
import type { UserType } from "../types/user";
import type { UserResponseType } from "../types/UserResponseType";

export type AuthContextType = {
  currentUser: UserResponseType | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (user: UserType) => Promise<UserResponseType>;
  updateUser: (user: UserType, currentPassword?: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  deleteAccount: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);
