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

/**
 * Reads and validates required scrapper environment variables.
 */
export const getScrapperEnv = (): ScrapperEnv => {
  const databaseUrl = process.env.DATABASE_URL;
  const tgBotToken = process.env.TG_BOT_TOKEN;
  const tgChannelId = process.env.TG_CHANNEL_ID;
  const sourceUrl = process.env.SCRAPPER_SOURCE_URL;
  const userAgent = process.env.SCRAPPER_USER_AGENT;

  const missing: string[] = [];
  if (!databaseUrl) missing.push("DATABASE_URL");
  if (!tgBotToken) missing.push("TG_BOT_TOKEN");
  if (!tgChannelId) missing.push("TG_CHANNEL_ID");
  if (!sourceUrl) missing.push("SCRAPPER_SOURCE_URL");
  if (!userAgent) missing.push("SCRAPPER_USER_AGENT");

  if (missing.length > 0) {
    throw new Error(`Missing required env vars for scrapper worker: ${missing.join(", ")}`);
  }

  return { databaseUrl, tgBotToken, tgChannelId, sourceUrl, userAgent };
};
