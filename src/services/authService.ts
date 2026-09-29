import type { UserType } from "../types/user";

const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

export function getUsers(): UserType[] {
  const users = localStorage.getItem(USERS_KEY);
  if (users) {
    return JSON.parse(users);
  } else {
    return [];
  }
}

export function registerUser(user: UserType): void {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function setCurrentUser(userId: string): void {
  localStorage.setItem(CURRENT_USER_KEY, userId);
}

export function getCurrentUser(): UserType | null {
  const userID = localStorage.getItem(CURRENT_USER_KEY);
  if (!userID) {
    return null;
  } else {
    const users = getUsers();
    const currentUser = users.find((item) => item.id === userID);
    return currentUser ?? null;
  }
}

export function logoutUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function updateUser(updatedUser: UserType) {
  const users = getUsers();

  const updatedUsers = users.map((user) =>
    user.id === updatedUser.id ? updatedUser : user,
  );

  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
}
