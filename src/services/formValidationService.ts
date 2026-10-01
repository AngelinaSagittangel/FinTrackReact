import type { RegisterErrorsType } from "../types/RegisterErrorsType";

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

export function validateRegisterForm(
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
): RegisterErrorsType {
  return {
    name: validateName(name) ?? undefined,
    email: validateEmail(email) ?? undefined,
    password: validatePassword(password) ?? undefined,
    confirmPassword:
      validateConfirmPassword(password, confirmPassword) ?? undefined,
  };
}
