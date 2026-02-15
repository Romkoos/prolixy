import { Router } from "express";
import type { HealthResponse } from "@prolixy/shared";

/**
 * Creates health endpoints for readiness checks.
 */
export const createHealthRouter = (): Router => {
  const router = Router();

  router.get("/", (_req, res) => {
    const payload: HealthResponse = {
      status: "ok",
      service: "api",
      timestamp: new Date().toISOString()
    };
    res.status(200).json(payload);
  });

  return router;
};
