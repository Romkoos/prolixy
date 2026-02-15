import { PrismaClient } from "@prisma/client";
import type { ArticleDto } from "@prolixy/shared";
import { toIsoOrNull } from "@prolixy/shared";

/**
 * Repository for persistence and retrieval of articles.
 */
export class ArticleRepository {
  private readonly prisma: PrismaClient;

  public constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Returns the latest articles sorted by creation date.
   */
  public async listLatest(limit: number): Promise<readonly ArticleDto[]> {
    const rows = await this.prisma.article.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: limit
    });

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      sourceUrl: row.sourceUrl,
      summary: row.summary,
      postedAt: toIsoOrNull(row.postedAt)
    }));
  }
}
