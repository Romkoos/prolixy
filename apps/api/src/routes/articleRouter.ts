import { Router } from "express";
import type { ArticleListResponseDto } from "@prolixy/shared";
import { ArticleService } from "../services/articleService.js";

/**
 * Creates article routes for read operations.
 */
export const createArticleRouter = (articleService: ArticleService): Router => {
  const router = Router();

  router.get("/", async (req, res, next) => {
    try {
      const limit = typeof req.query.limit === "string" ? req.query.limit : undefined;
      const items = await articleService.getLatest(limit);
      const payload: ArticleListResponseDto = { items };
      res.status(200).json(payload);
    } catch (error: unknown) {
      next(error);
    }
  });

  return router;
};
