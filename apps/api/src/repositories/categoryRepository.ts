import { PrismaClient } from "@prisma/client";
import type { CategoryDto } from "@prolixy/shared";

/**
 * Repository for persistence and retrieval of categories.
 */
export class CategoryRepository {
  private readonly prisma: PrismaClient;

  public constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Returns all categories sorted by name.
   */
  public async listAll(): Promise<readonly CategoryDto[]> {
    const rows = await this.prisma.category.findMany({
      orderBy: {
        name: "asc"
      }
    });

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString()
    }));
  }

  /**
   * Returns a category by id or null.
   */
  public async getById(id: string): Promise<CategoryDto | null> {
    const row = await this.prisma.category.findUnique({
      where: { id }
    });

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      name: row.name,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString()
    };
  }

  /**
   * Returns a category by name using case-insensitive comparison.
   */
  public async getByNameInsensitive(name: string): Promise<CategoryDto | null> {
    const row = await this.prisma.category.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive"
        }
      }
    });

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      name: row.name,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString()
    };
  }

  /**
   * Creates a category with the provided name.
   */
  public async create(name: string): Promise<CategoryDto> {
    const row = await this.prisma.category.create({
      data: { name }
    });

    return {
      id: row.id,
      name: row.name,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString()
    };
  }

  /**
   * Updates a category name and returns the updated category.
   */
  public async updateName(id: string, name: string): Promise<CategoryDto | null> {
    const result = await this.prisma.category.updateMany({
      where: { id },
      data: { name }
    });

    if (result.count === 0) {
      return null;
    }

    return this.getByIdOrThrow(id);
  }

  /**
   * Deletes a category by id and returns true if deleted.
   */
  public async deleteById(id: string): Promise<boolean> {
    const result = await this.prisma.category.deleteMany({
      where: { id }
    });
    return result.count > 0;
  }

  private async getByIdOrThrow(id: string): Promise<CategoryDto> {
    const row = await this.prisma.category.findUniqueOrThrow({
      where: { id }
    });

    return {
      id: row.id,
      name: row.name,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString()
    };
  }
}
