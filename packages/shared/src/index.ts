export interface HealthResponse {
  status: "ok";
  service: string;
  timestamp: string;
}

export interface ArticleDto {
  id: string;
  title: string;
  sourceUrl: string;
  summary: string | null;
  postedAt: string | null;
}

/**
 * Response payload for article list endpoint.
 */
export interface ArticleListResponseDto {
  items: readonly ArticleDto[];
}

/**
 * Represents a persisted category item in API responses.
 */
export interface CategoryDto {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Request payload for category creation.
 */
export interface CreateCategoryRequestDto {
  name: string;
}

/**
 * Request payload for category update.
 */
export interface UpdateCategoryRequestDto {
  name: string;
}

/**
 * Response payload for category list endpoint.
 */
export interface CategoryListResponseDto {
  items: readonly CategoryDto[];
}

/**
 * Response payload for category create/update endpoint.
 */
export interface CategoryItemResponseDto {
  item: CategoryDto;
}

/**
 * Response payload for category delete endpoint.
 */
export interface DeleteCategoryResponseDto {
  id: string;
}

/**
 * Normalizes category name input before validation/persistence.
 */
export const normalizeCategoryName = (value: string): string => {
  return value.trim();
};

export const toIsoOrNull = (date: Date | null): string | null => {
  return date ? date.toISOString() : null;
};
