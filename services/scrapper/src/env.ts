import dotenv from "dotenv";

dotenv.config();

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

  if (!databaseUrl || !tgBotToken || !tgChannelId || !sourceUrl || !userAgent) {
    throw new Error("Missing required env vars for scrapper worker.");
  }

  return { databaseUrl, tgBotToken, tgChannelId, sourceUrl, userAgent };
};
