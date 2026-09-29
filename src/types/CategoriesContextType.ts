import type { CategoryType } from "./CategoryType";
export type CategoriesContextType = {
  categories: CategoryType[];
  setCategories: (categories: CategoryType[], userId?: string) => void;
};
