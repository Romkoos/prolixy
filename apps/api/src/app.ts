import express, { type Express, type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { ApiError } from "./errors/apiError.js";
import { ArticleRepository } from "./repositories/articleRepository.js";
import { CategoryRepository } from "./repositories/categoryRepository.js";
import { createApiRouter } from "./routes/index.js";
import { ArticleService } from "./services/articleService.js";
import { CategoryService } from "./services/categoryService.js";

/**
 * Creates a fully wired Express application instance.
 */
export const createApp = (prisma: PrismaClient, frontendOrigins: readonly string[]): Express => {
  const app = express();
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || frontendOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`CORS blocked for origin: ${origin}`));
      },
      credentials: false
    })
  );
  app.use(express.json());

  const articleRepository = new ArticleRepository(prisma);
  const articleService = new ArticleService(articleRepository);
  const categoryRepository = new CategoryRepository(prisma);
  const categoryService = new CategoryService(categoryRepository);
  app.use("/", createApiRouter(articleService, categoryService));

  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    if (error && typeof error === "object") {
      const maybeError = error as { statusCode?: unknown; status?: unknown; type?: unknown };
      const statusCodeRaw =
        typeof maybeError.statusCode === "number"
          ? maybeError.statusCode
          : typeof maybeError.status === "number"
            ? maybeError.status
            : undefined;

      if (statusCodeRaw && statusCodeRaw >= 400 && statusCodeRaw < 500) {
        if (maybeError.type === "entity.parse.failed") {
          res.status(statusCodeRaw).json({ message: "Invalid JSON request body." });
          return;
        }
      }
    }

    console.error("Unhandled API error:", error);
    res.status(500).json({ message: "Internal server error" });
  });

  return app;
};
