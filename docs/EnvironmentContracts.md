# Environment Contracts

## Purpose / scope
Define required environment variables for each deployable service.

## Local vs production
- Local development uses `.env` files copied from `.env.example` templates.
- Railway production uses platform environment variables configured per service.

## API (`apps/api`)
- `PORT` - HTTP port for API server.
- `DATABASE_URL` - PostgreSQL DSN used by Prisma.

## Scrapper (`services/scrapper`)
- `DATABASE_URL` - PostgreSQL DSN used by Prisma.
- `TG_BOT_TOKEN` - Telegram bot token used for integration/auth.
- `TG_CHANNEL_ID` - Telegram channel target identifier.
- `SCRAPPER_SOURCE_URL` - source URL to scrape.
- `SCRAPPER_USER_AGENT` - user-agent string used for fetch/scrape.

## Poster (`services/poster`)
- `DATABASE_URL` - PostgreSQL DSN used by Prisma.
- `TG_BOT_TOKEN` - Telegram bot token used for posting.
- `TG_CHANNEL_ID` - Telegram channel target identifier.
- `POSTER_BATCH_SIZE` - number of items to process per run.

## Frontend (`apps/frontend`)
- `VITE_API_BASE_URL` - API base URL injected at build time (`vite build`).
