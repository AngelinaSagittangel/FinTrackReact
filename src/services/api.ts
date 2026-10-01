const API_URL = "http://localhost:3000/api";

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Произошла ошибка");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
