import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

    try {
      setErrors({});

      await login(email, password);
      navigate("/");
    } catch (error) {
      setErrors({
        email:
          error instanceof Error ? error.message : "Не удалось войти в аккаунт",
      });
    }
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
