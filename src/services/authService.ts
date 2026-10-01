import type { LoginResponseType } from "../types/LoginResponseType";
import type { UserType } from "../types/user";
import type { UserResponseType } from "../types/UserResponseType";
import { apiRequest } from "./api";

export async function registerUserApi(user: UserType) {
  const response = await apiRequest<UserResponseType>("/users", {
    method: "POST",
    body: JSON.stringify({
      name: user.name,
      email: user.email,
      password: user.password,
    }),
  });

  return response;
}

export async function loginUserApi(email: string, password: string) {
  const response = await apiRequest<LoginResponseType>("/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return response;
}

export async function logoutUserApi() {
  await apiRequest<void>("/logout", {
    method: "POST",
  });
}

export async function getCurrentUserApi() {
  const response = await apiRequest<UserResponseType>("/me");

  return response;
}

export async function updateUserApi(
  name: string,
  email: string,
  password?: string,
  currentPassword?: string,
) {
  const response = await apiRequest<UserResponseType>("/users/me", {
    method: "PUT",
    body: JSON.stringify({
      name,
      email,
      password,
      currentPassword,
    }),
  });

  return response;
}

export async function deleteUserApi() {
  await apiRequest<void>("/users/me", {
    method: "DELETE",
  });
}
