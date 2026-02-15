import dotenv from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const serviceEnvPath = resolve(currentDir, "../.env");
const rootEnvPath = resolve(currentDir, "../../../.env");

// Load root defaults first, then override with service-specific values.
dotenv.config({ path: rootEnvPath });
dotenv.config({ path: serviceEnvPath, override: true });

/**
 * Runtime environment contract for the poster worker.
 */
export interface PosterEnv {
  databaseUrl: string;
  tgBotToken: string;
  tgChannelId: string;
  batchSize: number;
}

/**
 * Reads and validates required poster environment variables.
 */
export const getPosterEnv = (): PosterEnv => {
  const databaseUrl = process.env.DATABASE_URL;
  const tgBotToken = process.env.TG_BOT_TOKEN;
  const tgChannelId = process.env.TG_CHANNEL_ID;
  const batchSizeRaw = process.env.POSTER_BATCH_SIZE ?? "10";

  const missing: string[] = [];
  if (!databaseUrl) missing.push("DATABASE_URL");
  if (!tgBotToken) missing.push("TG_BOT_TOKEN");
  if (!tgChannelId) missing.push("TG_CHANNEL_ID");

  if (missing.length > 0) {
    throw new Error(`Missing required env vars for poster worker: ${missing.join(", ")}`);
  }

  const batchSize = Number(batchSizeRaw);
  if (!Number.isInteger(batchSize) || batchSize <= 0) {
    throw new Error("POSTER_BATCH_SIZE must be a positive integer.");
  }

  return { databaseUrl, tgBotToken, tgChannelId, batchSize };
};
