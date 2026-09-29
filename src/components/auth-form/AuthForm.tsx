import { Link } from "react-router-dom";
import "./AuthForm.scss";
import type { AuthFormType } from "../../types/AuthFormType";

function AuthForm({
  isRegister,
  title,
  submitText,
  name,
  email,
  password,
  confirmPassword,
  errors,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: AuthFormType) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <h1 className="auth-form__title">{title}</h1>

      <div className="auth-form__fields">
        {isRegister && (
          <div className="auth-form__field">
            <input
              type="text"
              placeholder="Имя"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
            />

            {errors?.name && (
              <span className="auth-form__error">{errors.name}</span>
            )}
          </div>
        )}

        <div className="auth-form__field">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
          />

          {errors?.email && (
            <span className="auth-form__error">{errors.email}</span>
          )}
        </div>

        <div className="auth-form__field">
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
          />

          {errors?.password && (
            <span className="auth-form__error">{errors.password}</span>
          )}
        </div>

        {isRegister && (
          <div className="auth-form__field">
            <input
              type="password"
              placeholder="Повторите пароль"
              value={confirmPassword}
              onChange={(event) => onConfirmPasswordChange(event.target.value)}
            />

            {errors?.confirmPassword && (
              <span className="auth-form__error">{errors.confirmPassword}</span>
            )}
          </div>
        )}
      </div>

      <button className="auth-form__button" type="submit">
        {submitText}
      </button>

      <div className="auth-form__footer">
        {isRegister ? (
          <>
            <span>Уже есть аккаунт?</span>
            <Link to="/login">Войти</Link>
          </>
        ) : (
          <>
            <span>Нет аккаунта?</span>
            <Link to="/register">Зарегистрироваться</Link>
          </>
        )}
      </div>
    </form>
  );
}

export default AuthForm;
