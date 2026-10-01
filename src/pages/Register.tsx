import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import useWallets from "../hooks/useWallets";
import useCategories from "../hooks/useCategories";

import { validateRegisterForm } from "../services/formValidationService";

import AuthForm from "../components/auth-form/AuthForm";

import initialCategories from "../data/categories";

import type { AuthFormErrorsType } from "../types/AuthFormErrorsType";

import "./Register.scss";

function Register() {
  const { register } = useAuth();
  const { addWallet } = useWallets();
  const { addCategory } = useCategories();

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<AuthFormErrorsType>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateRegisterForm(
      name,
      email,
      password,
      confirmPassword,
    );

    setErrors(validationErrors);

    if (Object.values(validationErrors).some(Boolean)) {
      return;
    }

    try {
      setErrors({});

      const user = await register({
        id: "",
        name: name.trim(),
        email: email.trim(),
        password,
      });

      await addWallet({
        id: "",
        userId: user.id,
        name: "Карта",
        type: "card",
        initialAmount: 0,
      });

      await addWallet({
        id: "",
        userId: user.id,
        name: "Наличные",
        type: "cash",
        initialAmount: 0,
      });

      for (const category of initialCategories) {
        await addCategory({
          id: "",
          userId: user.id,
          name: category.name,
          color: category.color,
          type: category.type,
        });
      }

      navigate("/");
    } catch (error) {
      setErrors({
        email:
          error instanceof Error ? error.message : "Не удалось создать аккаунт",
      });
    }
  }

  function handleNameChange(value: string) {
    setName(value);

    setErrors((prev) => ({
      ...prev,
      name: undefined,
    }));
  }

  function handleEmailChange(value: string) {
    setEmail(value);

    setErrors((prev) => ({
      ...prev,
      email: undefined,
    }));
  }

  function handlePasswordChange(value: string) {
    setPassword(value);

    setErrors((prev) => ({
      ...prev,
      password: undefined,
    }));
  }

  function handleConfirmPasswordChange(value: string) {
    setConfirmPassword(value);

    setErrors((prev) => ({
      ...prev,
      confirmPassword: undefined,
    }));
  }

  return (
    <main className="register-page">
      <AuthForm
        isRegister
        title="Создать аккаунт"
        submitText="Зарегистрироваться"
        name={name}
        email={email}
        password={password}
        confirmPassword={confirmPassword}
        errors={errors}
        onNameChange={handleNameChange}
        onEmailChange={handleEmailChange}
        onPasswordChange={handlePasswordChange}
        onConfirmPasswordChange={handleConfirmPasswordChange}
        onSubmit={handleSubmit}
      />
    </main>
  );
}

export default Register;
