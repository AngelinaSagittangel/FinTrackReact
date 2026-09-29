import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getUsers } from "../services/authService";
import { validateRegisterForm } from "../services/formValidationService";

import AuthForm from "../components/auth-form/AuthForm";
import "./Register.scss";
import type { AuthFormErrorsType } from "../types/AuthFormErrorsType";
import useWallets from "../hooks/useWallets";
import useCategories from "../hooks/useCategories";
import initialCategories from "../data/categories";

function Register() {
  const { register } = useAuth();
  const { setWallets } = useWallets();
  const { setCategories } = useCategories();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<AuthFormErrorsType>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const users = getUsers();

    const validationErrors = validateRegisterForm(
      name,
      email,
      password,
      confirmPassword,
      users,
    );

    setErrors(validationErrors);

    if (Object.values(validationErrors).some(Boolean)) {
      return;
    }

    const user = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim(),
      password,
    };

    register(user);

    setWallets(
      [
        {
          id: crypto.randomUUID(),
          userId: user.id,
          name: "Карта",
          type: "card",
          initialAmount: 0,
        },
        {
          id: crypto.randomUUID(),
          userId: user.id,
          name: "Наличные",
          type: "cash",
          initialAmount: 0,
        },
      ],
      user.id,
    );

    setCategories(
      initialCategories.map((category) => ({
        id: crypto.randomUUID(),
        userId: user.id,
        name: category.name,
        color: category.color,
        type: category.type,
      })),
      user.id,
    );

    navigate("/");
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
