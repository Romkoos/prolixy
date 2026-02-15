import { Router } from "express";
import type {
  CategoryItemResponseDto,
  CategoryListResponseDto,
  CreateCategoryRequestDto,
  DeleteCategoryResponseDto,
  UpdateCategoryRequestDto
} from "@prolixy/shared";
import { CategoryService } from "../services/categoryService.js";

/**
 * Creates category CRUD routes.
 */
export const createCategoryRouter = (categoryService: CategoryService): Router => {
  const router = Router();

  router.get("/", async (_req, res, next) => {
    try {
      const items = await categoryService.listAll();
      const payload: CategoryListResponseDto = { items };
      res.status(200).json(payload);
    } catch (error: unknown) {
      next(error);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const payload = req.body as CreateCategoryRequestDto;
      const item = await categoryService.create(payload);
      const response: CategoryItemResponseDto = { item };
      res.status(201).json(response);
    } catch (error: unknown) {
      next(error);
    }
  });

  router.put("/:id", async (req, res, next) => {
    try {
      const payload = req.body as UpdateCategoryRequestDto;
      const item = await categoryService.update(req.params.id, payload);
      const response: CategoryItemResponseDto = { item };
      res.status(200).json(response);
    } catch (error: unknown) {
      next(error);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      await categoryService.delete(req.params.id);
      const response: DeleteCategoryResponseDto = { id: req.params.id };
      res.status(200).json(response);
    } catch (error: unknown) {
      next(error);
    }
  });

  return router;
};
