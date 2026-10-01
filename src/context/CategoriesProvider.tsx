import { useEffect, useState, type ReactNode } from "react";
import { CategoriesContext } from "./CategoriesContext";
import type { CategoryType } from "../types/CategoryType";
import { useAuth } from "../hooks/useAuth";
import {
  createCategoryApi,
  deleteCategoryApi,
  getCategoriesApi,
  updateCategoryApi,
} from "../services/categoryService";
function CategoriesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    getCategoriesApi()
      .then((categoriesFromApi) => {
        const formattedCategories = categoriesFromApi.map((category) => ({
          id: category.id,
          name: category.name,
          color: category.color,
          type: category.type,
          userId: category.userId,
        }));
        setCategories(formattedCategories);
      })
      .catch((error) => {
        console.error("Не удалось загрузить категории:", error);
      });
  }, [isAuthenticated]);
  async function addCategory(category: CategoryType) {
    const createdCategory = await createCategoryApi(
      category.name,
      category.color,
      category.type,
    );
    const formattedCategory = {
      id: createdCategory.id,
      name: createdCategory.name,
      color: createdCategory.color,
      type: createdCategory.type,
      userId: createdCategory.userId,
    };
    setCategories((prevCategories) => [...prevCategories, formattedCategory]);
    return formattedCategory;
  }
  async function editCategory(category: CategoryType) {
    const updatedCategory = await updateCategoryApi(category.id, category.name);
    const formattedCategory = {
      id: updatedCategory.id,
      name: updatedCategory.name,
      color: updatedCategory.color,
      type: updatedCategory.type,
      userId: updatedCategory.userId,
    };
    setCategories((prevCategories) =>
      prevCategories.map((currentCategory) =>
        currentCategory.id === category.id
          ? formattedCategory
          : currentCategory,
      ),
    );
    return formattedCategory;
  }
  async function removeCategory(id: string) {
    await deleteCategoryApi(id);
    setCategories((prevCategories) =>
      prevCategories.filter((category) => category.id !== id),
    );
  }
  return (
    <CategoriesContext.Provider
      value={{ categories, addCategory, editCategory, removeCategory }}
    >
      {" "}
      {children}{" "}
    </CategoriesContext.Provider>
  );
}
export default CategoriesProvider;
