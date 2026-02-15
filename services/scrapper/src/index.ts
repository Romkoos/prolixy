import { PrismaClient } from "@prisma/client";
import { getScrapperEnv } from "./env.js";

/**
 * Executes one scrapper run and exits.
 */
const run = async (): Promise<void> => {
  const env = getScrapperEnv();
  const prisma = new PrismaClient({
    datasourceUrl: env.databaseUrl
  });

  try {
    await prisma.$connect();

    // Stub scraping logic for bootstrap; replace with real extraction pipeline.
    const title = `Scraped at ${new Date().toISOString()}`;
    await prisma.article.upsert({
      where: { sourceUrl: env.sourceUrl },
      update: { title, summary: `User-Agent: ${env.userAgent}` },
      create: {
        title,
        sourceUrl: env.sourceUrl,
        summary: `User-Agent: ${env.userAgent}`
      }
    });

    console.log("Scrapper completed successfully.");
    process.exit(0);
  } catch (error: unknown) {
    console.error("Scrapper failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

void run();
