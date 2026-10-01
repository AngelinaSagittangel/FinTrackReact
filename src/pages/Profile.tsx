import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from "../services/formValidationService";
import "./Profile.scss";
function Profile() {
  const { currentUser, updateUser, deleteAccount } = useAuth();
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
  const [deleteError, setDeleteError] = useState("");
  async function handleNameSave() {
    if (!currentUser) {
      return;
    }
    const error = validateName(name);
    setNameError(error ?? "");
    if (error) {
      return;
    }
    try {
      await updateUser({ ...currentUser, name: name.trim(), password: "" });
      setNameError("");
      setEditingName(false);
    } catch (error) {
      setNameError(
        error instanceof Error ? error.message : "Не удалось изменить имя",
      );
    }
  }
  async function handleEmailSave() {
    if (!currentUser) {
      return;
    }
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }
    try {
      await updateUser({ ...currentUser, email: email.trim(), password: "" });
      setEmailError("");
      setEditingEmail(false);
    } catch (error) {
      setEmailError(
        error instanceof Error ? error.message : "Не удалось изменить email",
      );
    }
  }
  async function handlePasswordSave() {
    if (!currentUser) {
      return;
    }
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setNewPasswordError(passwordError);
      return;
    }
    const confirmError = validateConfirmPassword(newPassword, confirmPassword);
    if (confirmError) {
      setConfirmPasswordError(confirmError);
      return;
    }
    try {
      await updateUser(
        { ...currentUser, password: newPassword },
        currentPassword,
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPasswordError("");
      setNewPasswordError("");
      setConfirmPasswordError("");
      setEditingPassword(false);
    } catch (error) {
      setCurrentPasswordError(
        error instanceof Error ? error.message : "Не удалось изменить пароль",
      );
    }
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
  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Вы уверены, что хотите удалить аккаунт? Все данные аккаунта будут удалены без возможности восстановления.",
    );
    if (!confirmed) {
      return;
    }
    try {
      setDeleteError("");
      await deleteAccount();
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Не удалось удалить аккаунт",
      );
    }
  }
  return (
    <section className="profile">
      {" "}
      <header className="profile__header">
        {" "}
        <h2>Профиль</h2>{" "}
      </header>{" "}
      <div className="profile__card">
        {" "}
        <h3>Личные данные</h3>{" "}
        <div className="profile__field">
          {" "}
          <span>Имя</span>{" "}
          {editingName ? (
            <div className="profile__edit">
              {" "}
              <div>
                {" "}
                <input
                  type="text"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setNameError("");
                  }}
                />{" "}
                {nameError && (
                  <span className="profile__error">{nameError}</span>
                )}{" "}
              </div>{" "}
              <button type="button" onClick={handleNameSave}>
                {" "}
                Сохранить{" "}
              </button>{" "}
              <button
                type="button"
                onClick={() => {
                  setName(currentUser?.name ?? "");
                  setNameError("");
                  setEditingName(false);
                }}
              >
                {" "}
                Отмена{" "}
              </button>{" "}
            </div>
          ) : (
            <>
              {" "}
              <strong>{currentUser?.name}</strong>{" "}
              <button
                type="button"
                onClick={() => {
                  setName(currentUser?.name ?? "");
                  setNameError("");
                  setEditingName(true);
                }}
              >
                {" "}
                Изменить{" "}
              </button>{" "}
            </>
          )}{" "}
        </div>{" "}
        <div className="profile__field">
          {" "}
          <span>Email</span>{" "}
          {editingEmail ? (
            <div className="profile__edit">
              {" "}
              <div>
                {" "}
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setEmailError("");
                  }}
                />{" "}
                {emailError && (
                  <span className="profile__error">{emailError}</span>
                )}{" "}
              </div>{" "}
              <button type="button" onClick={handleEmailSave}>
                {" "}
                Сохранить{" "}
              </button>{" "}
              <button
                type="button"
                onClick={() => {
                  setEmail(currentUser?.email ?? "");
                  setEmailError("");
                  setEditingEmail(false);
                }}
              >
                {" "}
                Отмена{" "}
              </button>{" "}
            </div>
          ) : (
            <>
              {" "}
              <strong>{currentUser?.email}</strong>{" "}
              <button
                type="button"
                onClick={() => {
                  setEmail(currentUser?.email ?? "");
                  setEmailError("");
                  setEditingEmail(true);
                }}
              >
                {" "}
                Изменить{" "}
              </button>{" "}
            </>
          )}{" "}
        </div>{" "}
      </div>{" "}
      <div className="profile__card">
        {" "}
        <h3>Безопасность</h3>{" "}
        {editingPassword ? (
          <div className="profile__password">
            {" "}
            <div>
              {" "}
              <input
                type="password"
                placeholder="Текущий пароль"
                value={currentPassword}
                onChange={(event) => {
                  setCurrentPassword(event.target.value);
                  setCurrentPasswordError("");
                }}
              />{" "}
              {currentPasswordError && (
                <span className="profile__error">{currentPasswordError}</span>
              )}{" "}
            </div>{" "}
            <div>
              {" "}
              <input
                type="password"
                placeholder="Новый пароль"
                value={newPassword}
                onChange={(event) => {
                  setNewPassword(event.target.value);
                  setNewPasswordError("");
                }}
              />{" "}
              {newPasswordError && (
                <span className="profile__error">{newPasswordError}</span>
              )}{" "}
            </div>{" "}
            <div>
              {" "}
              <input
                type="password"
                placeholder="Повторите новый пароль"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setConfirmPasswordError("");
                }}
              />{" "}
              {confirmPasswordError && (
                <span className="profile__error">{confirmPasswordError}</span>
              )}{" "}
            </div>{" "}
            <div className="profile__password-actions">
              {" "}
              <button type="button" onClick={handlePasswordSave}>
                {" "}
                Сохранить{" "}
              </button>{" "}
              <button type="button" onClick={handlePasswordCancel}>
                {" "}
                Отмена{" "}
              </button>{" "}
            </div>{" "}
          </div>
        ) : (
          <div className="profile__field">
            {" "}
            <span>Пароль</span> <strong>••••••••</strong>{" "}
            <button
              type="button"
              onClick={() => {
                setCurrentPasswordError("");
                setNewPasswordError("");
                setConfirmPasswordError("");
                setEditingPassword(true);
              }}
            >
              {" "}
              Изменить{" "}
            </button>{" "}
          </div>
        )}{" "}
      </div>{" "}
      <div className="profile__card profile__card--danger">
        {" "}
        <h3>Удаление аккаунта</h3>{" "}
        <p className="profile__danger-text">
          {" "}
          Удаление аккаунта необратимо. Все ваши кошельки, категории, операции и
          бюджеты будут удалены.{" "}
        </p>{" "}
        <button
          className="profile__delete-button"
          type="button"
          onClick={handleDeleteAccount}
        >
          {" "}
          Удалить аккаунт{" "}
        </button>{" "}
        {deleteError && (
          <span className="profile__error">{deleteError}</span>
        )}{" "}
      </div>{" "}
    </section>
  );
}
export default Profile;
