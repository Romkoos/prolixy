import express, { type Express, type NextFunction, type Request, type Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ArticleRepository } from "./repositories/articleRepository.js";
import { createApiRouter } from "./routes/index.js";
import { ArticleService } from "./services/articleService.js";

/**
 * Creates a fully wired Express application instance.
 */
export const createApp = (prisma: PrismaClient): Express => {
  const app = express();
  app.use(express.json());

  const articleRepository = new ArticleRepository(prisma);
  const articleService = new ArticleService(articleRepository);
  app.use("/", createApiRouter(articleService));

  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Unhandled API error:", error);
    res.status(500).json({ message: "Internal server error" });
  });

  return app;
};
