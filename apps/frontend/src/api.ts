import type {
  ArticleDto,
  ArticleListResponseDto,
  CategoryDto,
  CategoryItemResponseDto,
  CategoryListResponseDto,
  CreateCategoryRequestDto,
  DeleteCategoryResponseDto,
  UpdateCategoryRequestDto
} from "@prolixy/shared";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("VITE_API_BASE_URL is required at build time.");
}

/**
 * Fetches latest articles from the API.
 */
export const fetchArticles = async (): Promise<readonly ArticleDto[]> => {
  const response = await fetch(`${apiBaseUrl}/articles`);
  if (!response.ok) {
    throw new Error(`Failed to load articles: ${response.status}`);
  }

  const body = (await response.json()) as ArticleListResponseDto;
  return body.items;
};

/**
 * Fetches all categories from the API.
 */
export const fetchCategories = async (): Promise<readonly CategoryDto[]> => {
  const response = await fetch(`${apiBaseUrl}/categories`);
  if (!response.ok) {
    throw new Error(`Failed to load categories: ${response.status}`);
  }

  const body = (await response.json()) as CategoryListResponseDto;
  return body.items;
};

/**
 * Creates a new category.
 */
export const createCategory = async (payload: CreateCategoryRequestDto): Promise<CategoryDto> => {
  const response = await fetch(`${apiBaseUrl}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({ message: "" }))) as { message?: string };
    throw new Error(errorBody.message || `Failed to create category: ${response.status}`);
  }

  const body = (await response.json()) as CategoryItemResponseDto;
  return body.item;
};

/**
 * Updates an existing category.
 */
export const updateCategory = async (
  id: string,
  payload: UpdateCategoryRequestDto
): Promise<CategoryDto> => {
  const response = await fetch(`${apiBaseUrl}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({ message: "" }))) as { message?: string };
    throw new Error(errorBody.message || `Failed to update category: ${response.status}`);
  }

  const body = (await response.json()) as CategoryItemResponseDto;
  return body.item;
};

/**
 * Deletes a category by id.
 */
export const deleteCategory = async (id: string): Promise<string> => {
  const response = await fetch(`${apiBaseUrl}/categories/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({ message: "" }))) as { message?: string };
    throw new Error(errorBody.message || `Failed to delete category: ${response.status}`);
  }

  const body = (await response.json()) as DeleteCategoryResponseDto;
  return body.id;
};
