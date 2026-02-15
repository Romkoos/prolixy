# Prolixy Monorepo

Monorepo stack: Node.js, React (Vite), PostgreSQL, Prisma.

## Structure
- `apps/api` - Express API (`/health`, `/articles`).
- `apps/frontend` - static SPA build served with Nginx in production.
- `services/scrapper` - one-shot worker for scraping.
- `services/poster` - one-shot worker for posting.
- `packages/shared` - shared types/utilities.
- `database/prisma` - Prisma schema and migrations (no runtime service).

## Local setup
1. Install dependencies:
   - `npm install`
2. Start PostgreSQL:
   - `docker compose up -d postgres`
3. Apply Prisma migrations:
   - `npm run prisma:migrate:deploy`
4. Seed database:
   - `npm run prisma:seed`
5. Run services:
   - API: `npm run dev:api`
   - Frontend: `npm run dev:frontend`
   - Scrapper one-shot: `npm run dev:scrapper`
   - Poster one-shot: `npm run dev:poster`

## Docker local integration
- Build and run full stack:
  - `docker compose up --build`
- Frontend: `http://localhost:8080`
- API health: `http://localhost:3000/health`

## Railway deployment model
- Deploy each service separately using:
  - `apps/api/Dockerfile`
  - `apps/frontend/Dockerfile`
  - `services/scrapper/Dockerfile`
  - `services/poster/Dockerfile`
- Production database is Railway PostgreSQL; set `DATABASE_URL` per service.
