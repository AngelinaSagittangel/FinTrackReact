import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
  validateUniqueEmail,
} from "../services/formValidationService";
import { getUsers } from "../services/authService";
import "./Profile.scss";

function Profile() {
  const { currentUser, updateUser } = useAuth();

  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  const [name, setName] = useState(currentUser?.name ?? "");
  const [email, setEmail] = useState(currentUser?.email ?? "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  function handleNameSave() {
    if (!currentUser) {
      return;
    }

    const error = validateName(name);

    setNameError(error ?? "");

    if (error) {
      return;
    }

    updateUser({
      ...currentUser,
      name: name.trim(),
    });

    setNameError("");
    setEditingName(false);
  }

  function handleEmailSave() {
    if (!currentUser) {
      return;
    }

    const emailValidationError = validateEmail(email);

    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    const uniqueEmailError = validateUniqueEmail(
      email,
      getUsers(),
      currentUser.id,
    );

    if (uniqueEmailError) {
      setEmailError(uniqueEmailError);
      return;
    }

    updateUser({
      ...currentUser,
      email: email.trim(),
    });

    setEmailError("");
    setEditingEmail(false);
  }

  function handlePasswordSave() {
    if (!currentUser) {
      return;
    }

    const currentPasswordIsCorrect = currentPassword === currentUser.password;

    if (!currentPasswordIsCorrect) {
      setCurrentPasswordError("Неверный текущий пароль");
      return;
    }

    const newPasswordError = validatePassword(newPassword);

    if (newPasswordError) {
      setNewPasswordError(newPasswordError);
      return;
    }

    const confirmPasswordError = validateConfirmPassword(
      newPassword,
      confirmPassword,
    );

    if (confirmPasswordError) {
      setConfirmPasswordError(confirmPasswordError);
      return;
    }

    updateUser({
      ...currentUser,
      password: newPassword,
    });

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setCurrentPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");

    setEditingPassword(false);
  }

  function handlePasswordCancel() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setCurrentPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");

    setEditingPassword(false);
  }

  return (
    <section className="profile">
      <header className="profile__header">
        <h2>Профиль</h2>
      </header>

      <div className="profile__card">
        <h3>Личные данные</h3>

        <div className="profile__field">
          <span>Имя</span>

          {editingName ? (
            <div className="profile__edit">
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setNameError("");
                  }}
                />

                {nameError && (
                  <span className="profile__error">{nameError}</span>
                )}
              </div>

              <button type="button" onClick={handleNameSave}>
                Сохранить
              </button>

              <button
                type="button"
                onClick={() => {
                  setName(currentUser?.name ?? "");
                  setNameError("");
                  setEditingName(false);
                }}
              >
                Отмена
              </button>
            </div>
          ) : (
            <>
              <strong>{currentUser?.name}</strong>

              <button
                type="button"
                onClick={() => {
                  setName(currentUser?.name ?? "");
                  setNameError("");
                  setEditingName(true);
                }}
              >
                Изменить
              </button>
            </>
          )}
        </div>

        <div className="profile__field">
          <span>Email</span>

          {editingEmail ? (
            <div className="profile__edit">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setEmailError("");
                  }}
                />

                {emailError && (
                  <span className="profile__error">{emailError}</span>
                )}
              </div>

              <button type="button" onClick={handleEmailSave}>
                Сохранить
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail(currentUser?.email ?? "");
                  setEmailError("");
                  setEditingEmail(false);
                }}
              >
                Отмена
              </button>
            </div>
          ) : (
            <>
              <strong>{currentUser?.email}</strong>

              <button
                type="button"
                onClick={() => {
                  setEmail(currentUser?.email ?? "");
                  setEmailError("");
                  setEditingEmail(true);
                }}
              >
                Изменить
              </button>
            </>
          )}
        </div>
      </div>

      <div className="profile__card">
        <h3>Безопасность</h3>

        {editingPassword ? (
          <div className="profile__password">
            <div>
              <input
                type="password"
                placeholder="Текущий пароль"
                value={currentPassword}
                onChange={(event) => {
                  setCurrentPassword(event.target.value);
                  setCurrentPasswordError("");
                }}
              />

              {currentPasswordError && (
                <span className="profile__error">{currentPasswordError}</span>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Новый пароль"
                value={newPassword}
                onChange={(event) => {
                  setNewPassword(event.target.value);
                  setNewPasswordError("");
                }}
              />

              {newPasswordError && (
                <span className="profile__error">{newPasswordError}</span>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Повторите новый пароль"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setConfirmPasswordError("");
                }}
              />

              {confirmPasswordError && (
                <span className="profile__error">{confirmPasswordError}</span>
              )}
            </div>

            <div className="profile__password-actions">
              <button type="button" onClick={handlePasswordSave}>
                Сохранить
              </button>

              <button type="button" onClick={handlePasswordCancel}>
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <div className="profile__field">
            <span>Пароль</span>

            <strong>••••••••</strong>

            <button
              type="button"
              onClick={() => {
                setCurrentPasswordError("");
                setNewPasswordError("");
                setConfirmPasswordError("");
                setEditingPassword(true);
              }}
            >
              Изменить
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Profile;
