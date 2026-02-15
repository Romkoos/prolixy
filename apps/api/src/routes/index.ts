import { Router } from "express";
import { ArticleService } from "../services/articleService.js";
import { createArticleRouter } from "./articleRouter.js";
import { createHealthRouter } from "./healthRouter.js";

/**
 * Composes all API routers under stable prefixes.
 */
export const createApiRouter = (articleService: ArticleService): Router => {
  const router = Router();
  router.use("/health", createHealthRouter());
  router.use("/articles", createArticleRouter(articleService));
  return router;
};
