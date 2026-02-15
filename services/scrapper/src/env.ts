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
 * Runtime environment contract for the scrapper worker.
 */
export interface ScrapperEnv {
  databaseUrl: string;
  tgBotToken: string;
  tgChannelId: string;
  sourceUrl: string;
  userAgent: string;
}

const requireEnv = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new Error(`Missing required env var for scrapper worker: ${name}`);
  }
  return value;
};

/**
 * Reads and validates required scrapper environment variables.
 */
export const getScrapperEnv = (): ScrapperEnv => {
  const databaseUrl = requireEnv(process.env.DATABASE_URL, "DATABASE_URL");
  const tgBotToken = requireEnv(process.env.TG_BOT_TOKEN, "TG_BOT_TOKEN");
  const tgChannelId = requireEnv(process.env.TG_CHANNEL_ID, "TG_CHANNEL_ID");
  const sourceUrl = requireEnv(process.env.SCRAPPER_SOURCE_URL, "SCRAPPER_SOURCE_URL");
  const userAgent = requireEnv(process.env.SCRAPPER_USER_AGENT, "SCRAPPER_USER_AGENT");

  return { databaseUrl, tgBotToken, tgChannelId, sourceUrl, userAgent };
};
