import dotenv from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();
const currentDir = dirname(fileURLToPath(import.meta.url));
const rootEnvPath = resolve(currentDir, "../../../../.env");
dotenv.config({ path: rootEnvPath });

/**
 * Typed runtime environment contract for the API service.
 */
export interface ApiEnv {
  port: number;
  databaseUrl: string;
  frontendOrigins: readonly string[];
}

/**
 * Validates and returns required API environment variables.
 */
export const getApiEnv = (): ApiEnv => {
  const portRaw = process.env.PORT ?? "3000";
  const databaseUrl = process.env.DATABASE_URL;
  const frontendOriginsRaw = process.env.FRONTEND_ORIGINS ?? "";

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for API service.");
  }

  const port = Number(portRaw);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("PORT must be a positive integer.");
  }

  const defaults: readonly string[] = [
    "http://localhost:5173",
    "http://localhost:5175",
    "https://prolixyfrontend-production.up.railway.app"
  ];
  const configured = frontendOriginsRaw
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  const frontendOrigins = configured.length > 0 ? configured : [...defaults];

  return { port, databaseUrl, frontendOrigins };
};
