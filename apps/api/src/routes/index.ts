import { Router } from "express";
import { ArticleService } from "../services/articleService.js";
import { CategoryService } from "../services/categoryService.js";
import { createArticleRouter } from "./articleRouter.js";
import { createCategoryRouter } from "./categoryRouter.js";
import { createHealthRouter } from "./healthRouter.js";

/**
 * Composes all API routers under stable prefixes.
 */
export const createApiRouter = (articleService: ArticleService, categoryService: CategoryService): Router => {
  const router = Router();
  router.use("/health", createHealthRouter());
  router.use("/articles", createArticleRouter(articleService));
  router.use("/categories", createCategoryRouter(categoryService));
  return router;
};
