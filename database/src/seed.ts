import { Client } from "pg";

const runSeed = async (): Promise<void> => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for seeding.");
  }

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    await client.query(
      `
      INSERT INTO "Article" ("id", "title", "sourceUrl", "summary", "postedAt", "createdAt", "updatedAt")
      VALUES
        ('seed_article_1', 'Welcome to Prolixy', 'https://example.com/prolixy', 'Initial seeded article.', NULL, NOW(), NOW())
      ON CONFLICT ("sourceUrl") DO NOTHING;
      `
    );
  } finally {
    await client.end();
  }
};

runSeed()
  .then(() => {
    process.exitCode = 0;
  })
  .catch((error: unknown) => {
    // Keep logs concise for CI and Railway job output.
    console.error("Seed failed:", error);
    process.exitCode = 1;
  });
