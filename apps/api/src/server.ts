import { PrismaClient } from "@prisma/client";
import { createApp } from "./app.js";
import { getApiEnv } from "./config/env.js";

const env = getApiEnv();
const prisma = new PrismaClient({
  datasourceUrl: env.databaseUrl
});

const app = createApp(prisma);

const run = async (): Promise<void> => {
  await prisma.$connect();
  app.listen(env.port, () => {
    console.log(`API listening on port ${env.port}`);
  });
};

run().catch(async (error: unknown) => {
  console.error("API startup failed:", error);
  await prisma.$disconnect();
  process.exit(1);
});
