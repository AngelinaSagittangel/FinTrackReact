import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getUsers } from "../services/authService";
import {
  validateEmail,
  validatePassword,
} from "../services/formValidationService";
import type { AuthFormErrorsType } from "../types/AuthFormErrorsType";
import AuthForm from "../components/auth-form/AuthForm";
import "./Login.scss";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<AuthFormErrorsType>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    const validationErrors: AuthFormErrorsType = {
      email: emailError ?? undefined,
      password: passwordError ?? undefined,
    };

    if (Object.values(validationErrors).some(Boolean)) {
      setErrors(validationErrors);
      return;
    }

    const users = getUsers();

    const user = users.find(
      (item) => item.email.toLowerCase() === email.trim().toLowerCase(),
    );

    if (!user) {
      setErrors({
        email: "Пользователь с таким email не найден",
      });
      return;
    }

    if (user.password !== password) {
      setErrors({
        password: "Неверный пароль",
      });
      return;
    }

    setErrors({});

    login(user.id);
    navigate("/");
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

  return (
    <main className="login-page">
      <AuthForm
        isRegister={false}
        title="Войти в аккаунт"
        submitText="Войти"
        name=""
        email={email}
        password={password}
        confirmPassword=""
        errors={errors}
        onNameChange={() => {}}
        onEmailChange={handleEmailChange}
        onPasswordChange={handlePasswordChange}
        onConfirmPasswordChange={() => {}}
        onSubmit={handleSubmit}
      />
    </main>
  );
}

export default Login;
