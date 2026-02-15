import dotenv from "dotenv";

dotenv.config();

/**
 * Typed runtime environment contract for the API service.
 */
export interface ApiEnv {
  port: number;
  databaseUrl: string;
}

/**
 * Validates and returns required API environment variables.
 */
export const getApiEnv = (): ApiEnv => {
  const portRaw = process.env.PORT ?? "3000";
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for API service.");
  }

  const port = Number(portRaw);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("PORT must be a positive integer.");
  }

  return { port, databaseUrl };
};
