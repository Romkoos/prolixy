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

const requireEnv = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new Error(`Missing required env var for poster worker: ${name}`);
  }
  return value;
};

/**
 * Reads and validates required poster environment variables.
 */
export const getPosterEnv = (): PosterEnv => {
  const databaseUrl = requireEnv(process.env.DATABASE_URL, "DATABASE_URL");
  const tgBotToken = requireEnv(process.env.TG_BOT_TOKEN, "TG_BOT_TOKEN");
  const tgChannelId = requireEnv(process.env.TG_CHANNEL_ID, "TG_CHANNEL_ID");
  const batchSizeRaw = process.env.POSTER_BATCH_SIZE ?? "10";

  const batchSize = Number(batchSizeRaw);
  if (!Number.isInteger(batchSize) || batchSize <= 0) {
    throw new Error("POSTER_BATCH_SIZE must be a positive integer.");
  }

  return { databaseUrl, tgBotToken, tgChannelId, batchSize };
};
