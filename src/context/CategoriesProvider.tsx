import { useState, type ReactNode } from "react";

import { CategoriesContext } from "./CategoriesContext";
import type { CategoryType } from "../types/CategoryType";
import { useAuth } from "../hooks/useAuth";

function CategoriesProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();

  const [allCategories, setAllCategories] = useState<CategoryType[]>(() => {
    const savedCategories = localStorage.getItem("categories");

    return savedCategories
      ? (JSON.parse(savedCategories) as CategoryType[])
      : [];
  });

  const categories = currentUser
    ? allCategories.filter((category) => category.userId === currentUser.id)
    : [];

  const setCategories = (userCategories: CategoryType[], userId?: string) => {
    const targetUserId = userId ?? currentUser?.id;

    if (!targetUserId) {
      return;
    }

    const otherUsersCategories = allCategories.filter(
      (category) => category.userId !== targetUserId,
    );

    const updatedCategories = [...otherUsersCategories, ...userCategories];

    setAllCategories(updatedCategories);

    localStorage.setItem("categories", JSON.stringify(updatedCategories));
  };

  return (
    <CategoriesContext.Provider value={{ categories, setCategories }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export default CategoriesProvider;
