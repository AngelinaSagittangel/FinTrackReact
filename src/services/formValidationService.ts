import type { RegisterErrorsType } from "../types/RegisterErrorsType";
import type { UserType } from "../types/user";

export function validateName(name: string): string | null {
  const value = name.trim();

  if (!value) {
    return "Введите имя";
  }

  if (value.length < 2) {
    return "Имя должно содержать минимум 2 символа";
  }

  return null;
}

export function validateEmail(email: string): string | null {
  const value = email.trim();

  if (!value) {
    return "Введите email";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(value)) {
    return "Введите корректный email";
  }

  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return "Введите пароль";
  }

  if (password.length < 6) {
    return "Пароль должен содержать минимум 6 символов";
  }

  return null;
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
): string | null {
  if (!confirmPassword) {
    return "Повторите пароль";
  }

  if (password !== confirmPassword) {
    return "Пароли не совпадают";
  }

  return null;
}

export function validateUniqueEmail(
  email: string,
  users: UserType[],
  currentUserId?: string,
): string | null {
  const normalizedEmail = email.trim().toLowerCase();

  const emailExists = users.some(
    (user) =>
      user.id !== currentUserId && user.email.toLowerCase() === normalizedEmail,
  );

  if (emailExists) {
    return "Пользователь с таким email уже существует";
  }

  return null;
}

export function validateRegisterForm(
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  users: UserType[],
): RegisterErrorsType {
  return {
    name: validateName(name) ?? undefined,
    email:
      validateEmail(email) ?? validateUniqueEmail(email, users) ?? undefined,
    password: validatePassword(password) ?? undefined,
    confirmPassword:
      validateConfirmPassword(password, confirmPassword) ?? undefined,
  };
}
