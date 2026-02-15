import { PrismaClient } from "@prisma/client";
import { getPosterEnv } from "./env.js";

/**
 * Executes one poster run and exits.
 */
const run = async (): Promise<void> => {
  const env = getPosterEnv();
  const prisma = new PrismaClient({
    datasourceUrl: env.databaseUrl
  });

  try {
    await prisma.$connect();

    const articles = await prisma.article.findMany({
      where: { postedAt: null },
      orderBy: { createdAt: "asc" },
      take: env.batchSize
    });

    for (const article of articles) {
      // Replace with Telegram API integration.
      console.log(`[POST] ${article.title} -> channel ${env.tgChannelId}`);
      await prisma.article.update({
        where: { id: article.id },
        data: { postedAt: new Date() }
      });
    }

    console.log(`Poster completed. Posted ${articles.length} item(s).`);
    process.exit(0);
  } catch (error: unknown) {
    console.error("Poster failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

void run();
