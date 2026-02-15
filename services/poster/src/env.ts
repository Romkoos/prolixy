import dotenv from "dotenv";

dotenv.config();

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

  if (!databaseUrl || !tgBotToken || !tgChannelId) {
    throw new Error("Missing required env vars for poster worker.");
  }

  const batchSize = Number(batchSizeRaw);
  if (!Number.isInteger(batchSize) || batchSize <= 0) {
    throw new Error("POSTER_BATCH_SIZE must be a positive integer.");
  }

  return { databaseUrl, tgBotToken, tgChannelId, batchSize };
};
