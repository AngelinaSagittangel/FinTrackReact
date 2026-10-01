import type { CategoryType } from "./CategoryType";
export type CategoriesContextType = {
  categories: CategoryType[];
  addCategory: (category: CategoryType) => Promise<CategoryType>;
  editCategory: (category: CategoryType) => Promise<CategoryType>;
  removeCategory: (id: string) => Promise<void>;
};
