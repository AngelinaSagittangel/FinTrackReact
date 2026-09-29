import { useContext } from "react";

import { CategoriesContext } from "../context/CategoriesContext";

function useCategories() {
  const context = useContext(CategoriesContext);

  if (context === null) {
    throw new Error("useCategories must be used within CategoriesProvider");
  }

  return context;
}

export default useCategories;
