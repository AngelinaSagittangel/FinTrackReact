import { useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { UserType } from "../types/user";
import {
  getCurrentUser,
  logoutUser,
  registerUser,
  setCurrentUser,
  updateUser as updateUserStorage,
} from "../services/authService";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUserState] = useState<UserType | null>(
    getCurrentUser(),
  );

  const isAuthenticated = currentUser !== null;

  function login(userId: string) {
    setCurrentUser(userId);

    const user = getCurrentUser();

    setCurrentUserState(user);
  }

  function register(user: UserType) {
    registerUser(user);
    setCurrentUser(user.id);
    setCurrentUserState(user);
  }

  function updateUser(user: UserType) {
    updateUserStorage(user);
    setCurrentUserState(user);
  }

  function logout() {
    logoutUser();
    setCurrentUserState(null);
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        register,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
