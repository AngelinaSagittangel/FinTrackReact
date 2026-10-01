import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { UserType } from "../types/user";
import {
  getCurrentUserApi,
  loginUserApi,
  logoutUserApi,
  registerUserApi,
  updateUserApi,
  deleteUserApi,
} from "../services/authService";
import type { UserResponseType } from "../types/UserResponseType";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true);

  const [currentUser, setCurrentUserState] = useState<UserResponseType | null>(
    null,
  );

  const isAuthenticated = currentUser !== null;

  useEffect(() => {
    getCurrentUserApi()
      .then((user) => {
        setCurrentUserState(user);
      })
      .catch(() => {
        setCurrentUserState(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  async function login(email: string, password: string) {
    const response = await loginUserApi(email, password);

    setCurrentUserState(response.user);
  }

  async function register(user: UserType) {
    await registerUserApi(user);

    const response = await loginUserApi(user.email, user.password);

    setCurrentUserState(response.user);

    return response.user;
  }

  async function updateUser(user: UserType, currentPassword?: string) {
    const updatedUser = await updateUserApi(
      user.name,
      user.email,
      user.password,
      currentPassword,
    );

    setCurrentUserState(updatedUser);
  }

  async function logout() {
    await logoutUserApi();

    setCurrentUserState(null);
  }

  async function deleteAccount() {
    await deleteUserApi();

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
        isLoading,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
