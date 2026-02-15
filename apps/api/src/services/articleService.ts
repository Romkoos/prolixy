import type { ArticleDto } from "@prolixy/shared";
import { ArticleRepository } from "../repositories/articleRepository.js";

/**
 * Service layer for article business operations.
 */
export class ArticleService {
  private readonly articleRepository: ArticleRepository;

  public constructor(articleRepository: ArticleRepository) {
    this.articleRepository = articleRepository;
  }

  /**
   * Lists latest articles with basic limit normalization.
   */
  public async getLatest(limitParam?: string): Promise<readonly ArticleDto[]> {
    const parsed = Number(limitParam ?? "20");
    const safeLimit = Number.isInteger(parsed) && parsed > 0 && parsed <= 100 ? parsed : 20;
    return this.articleRepository.listLatest(safeLimit);
  }
}
