import type { FormEvent } from "react";
import type { AuthFormErrorsType } from "./AuthFormErrorsType";

export type AuthFormType = {
  isRegister: boolean;
  title: string;
  submitText: string;

  name: string;
  email: string;
  password: string;
  confirmPassword: string;

  errors?: AuthFormErrorsType;

  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;

  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};
