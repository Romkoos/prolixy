import {
  type CategoryDto,
  normalizeCategoryName,
  type CreateCategoryRequestDto,
  type UpdateCategoryRequestDto
} from "@prolixy/shared";
import { ApiError } from "../errors/apiError.js";
import { CategoryRepository } from "../repositories/categoryRepository.js";

/**
 * Service layer for category business operations and validation.
 */
export class CategoryService {
  private readonly categoryRepository: CategoryRepository;

  public constructor(categoryRepository: CategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  /**
   * Lists all available categories.
   */
  public async listAll(): Promise<readonly CategoryDto[]> {
    return this.categoryRepository.listAll();
  }

  /**
   * Creates a new category after validation and uniqueness checks.
   */
  public async create(payload: unknown): Promise<CategoryDto> {
    const name = this.extractName(payload, "create");
    await this.ensureNameIsUnique(name);
    return this.categoryRepository.create(name);
  }

  /**
   * Updates a category name after validation and uniqueness checks.
   */
  public async update(id: string, payload: unknown): Promise<CategoryDto> {
    this.ensureValidId(id);
    const current = await this.categoryRepository.getById(id);
    if (!current) {
      throw new ApiError(404, "Category not found.");
    }

    const name = this.extractName(payload, "update");
    const sameName = current.name.toLocaleLowerCase() === name.toLocaleLowerCase();
    if (!sameName) {
      await this.ensureNameIsUnique(name, id);
    }

    const updated = await this.categoryRepository.updateName(id, name);
    if (!updated) {
      throw new ApiError(404, "Category not found.");
    }

    return updated;
  }

  /**
   * Deletes an existing category by id.
   */
  public async delete(id: string): Promise<void> {
    this.ensureValidId(id);
    const deleted = await this.categoryRepository.deleteById(id);
    if (!deleted) {
      throw new ApiError(404, "Category not found.");
    }
  }

  private ensureValidId(id: string): void {
    if (typeof id !== "string" || id.trim().length === 0) {
      throw new ApiError(400, "Category id is required.");
    }
  }

  private validateAndNormalizeName(name: unknown): string {
    if (typeof name !== "string") {
      throw new ApiError(400, "Category name must be a string.");
    }

    const normalized = normalizeCategoryName(name);
    if (normalized.length === 0) {
      throw new ApiError(400, "Category name cannot be empty.");
    }

    if (normalized.length > 120) {
      throw new ApiError(400, "Category name must be at most 120 characters.");
    }

    return normalized;
  }

  private extractName(payload: unknown, mode: "create" | "update"): string {
    if (!payload || typeof payload !== "object") {
      throw new ApiError(400, `Invalid category ${mode} payload.`);
    }

    const typedPayload =
      mode === "create"
        ? (payload as CreateCategoryRequestDto)
        : (payload as UpdateCategoryRequestDto);

    return this.validateAndNormalizeName(typedPayload.name);
  }

  private async ensureNameIsUnique(name: string, currentId?: string): Promise<void> {
    const existing = await this.categoryRepository.getByNameInsensitive(name);
    if (existing && existing.id !== currentId) {
      throw new ApiError(409, "Category with this name already exists.");
    }
  }
}
