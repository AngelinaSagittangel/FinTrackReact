import { apiRequest } from "./api";

type CategoryApiResponse = {
  id: string;
  name: string;
  color: string;
  type: "income" | "expense";
  userId: string;
  createdAt: string;
};

export async function getCategoriesApi() {
  return apiRequest<CategoryApiResponse[]>("/categories");
}

export async function createCategoryApi(
  name: string,
  color: string,
  type: CategoryApiResponse["type"],
) {
  return apiRequest<CategoryApiResponse>("/categories", {
    method: "POST",
    body: JSON.stringify({
      name,
      color,
      type,
    }),
  });
}

export async function updateCategoryApi(id: string, name: string) {
  return apiRequest<CategoryApiResponse>(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      name,
    }),
  });
}

export async function deleteCategoryApi(id: string) {
  return apiRequest<void>(`/categories/${id}`, {
    method: "DELETE",
  });
}
