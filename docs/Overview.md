# Overview

## Purpose / scope
This repository is a Node + React + PostgreSQL monorepo prepared for local Docker usage and Railway deployment as separate services.

## Where it lives
- `apps/api` - HTTP API.
- `apps/frontend` - static SPA built with Vite and served by Nginx.
- `services/scrapper` - one-shot worker for scraping/importing.
- `services/poster` - one-shot worker for posting/publishing.
- `packages/shared` - reusable cross-service types/utilities.
- `database/prisma` - Prisma schema and migrations (not a runtime service).

## Runtime flow
1. `scrapper` writes normalized articles to PostgreSQL.
2. `api` exposes `/health` and `/articles`.
3. `frontend` calls `api` through `VITE_API_BASE_URL`.
4. `poster` reads unpublished rows and marks them as posted.

## Deployment model
- `api`, `frontend`, `scrapper`, and `poster` are separate Railway services.
- PostgreSQL is Railway-managed in production.
- Local PostgreSQL is provided by `docker-compose.yml`.
