# Task: Monorepo Bootstrap for API, Frontend, Prisma DB, and Workers

## Context
- Ticket/Request: Initialize a Node + React + PostgreSQL monorepo for Railway deployment.
- Related docs: No `docs/` directory exists yet in this workspace.

## Objective
Create a production-ready monorepo skeleton with separate deployable services (`api`, `frontend`, `services/scrapper`, `services/poster`), a `database/` utility folder for Prisma schema/migrations/seed only, shared code (`types` + `utils`), Dockerfiles for each deployable service, and local orchestration so all parts run together.

## Technical Approach
Use npm workspaces as the monorepo foundation with clear service boundaries:

- `apps/api`: Express + TypeScript with production-ready layering (`router` -> `service` -> `repository`) and `/health`.
- `apps/frontend`: React + Vite + TypeScript consuming API URL from environment.
- `services/scrapper`, `services/poster`: independent worker services with separate entrypoints and Dockerfiles; suitable for Railway cron/service triggers.
- `packages/shared`: reusable types/utilities used across services.
- `database`: Prisma-only utility folder (schema, migrations, seed scripts), not an npm workspace, no runtime service, no database Dockerfile.

Prisma strategy:
- Centralize Prisma schema and migrations in `database/prisma/`.
- Install `prisma` CLI only in root `devDependencies`.
- Install `@prisma/client` only in runtime services that access DB (`apps/api`, `services/scrapper`, `services/poster`).
- Use root scripts for `prisma generate`, `migrate dev`, `migrate deploy`, and `db seed`.
- Ensure Prisma can run locally against Compose Postgres and in production against Railway Postgres via environment-provided `DATABASE_URL`.

Docker strategy:
- Every service Dockerfile uses repository root as build context.
- Every service Dockerfile is multi-stage and uses this concrete sequence:
  1. Copy root manifests (`package.json`, `package-lock.json`, workspace manifests, tsconfig, Prisma folder, source).
  2. Run `npm ci` from root.
  3. Run `npm run build -w packages/shared`.
  4. For Prisma services (`api`, `scrapper`, `poster`): run `npm run prisma:generate`.
  5. Run `npm run build -w <target-workspace>`.
  6. Create runtime layer with only production dependencies (`npm ci --omit=dev`) and built artifacts for target workspace + required shared artifacts.
- Frontend Dockerfile uses build stage (`vite build`) and runtime Nginx stage serving `dist/`.
- Add root `.dockerignore` to reduce context size and avoid leaking local artifacts.

Environment strategy:
- Local: `.env` files (tracked as `.env.example`) for each service and Prisma.
- Production (Railway): use Railway environment variables with explicit contracts documented per service.
- Frontend variables are injected at build time (`VITE_*`), not runtime.

## Implementation Steps
- [x] Step 1: Scaffold root monorepo configuration (`package.json`, workspace settings, base TS config, git ignore, root README).
- [x] Step 2: Finalize and document Docker/workspace build strategy before creating Dockerfiles.
- [x] Step 3: Scaffold `database` Prisma utility folder (`schema.prisma`, migration scripts, seed script, root Prisma scripts).
- [x] Step 4: Scaffold `shared` workspace with reusable types/utilities and build config.
- [x] Step 5: Scaffold `api` service with layered structure (`router`/`service`/`repository`), `/health`, Prisma integration, and env contract.
- [x] Step 6: Scaffold `frontend` service (React + Vite + TS) as static SPA with build-time env contract.
- [x] Step 7: Scaffold `services/scrapper` and `services/poster` as one-shot workers (execute then exit) with explicit env contracts.
- [x] Step 8: Create Dockerfiles for all deployable services according to locked build strategy.
- [x] Step 9: Add root `docker-compose.yml` for local Postgres + all services integration (no standalone `database` runtime service).
- [x] Step 10: Validate install/build/lint basics and local integration commands.
- [x] Step 11: Add project docs under `docs/` to describe architecture, env contracts, Prisma workflow, Docker strategy, and deployment model.
- [ ] Step 12: Initialize git repository and create initial commit.

## Files to Modify/Create
- `package.json` - root npm workspaces and scripts.
- `tsconfig.base.json` - shared TS compiler baseline.
- `.gitignore` - monorepo ignore rules.
- `docker-compose.yml` - local multi-service orchestration.
- `apps/api/*` - API source, config, and Dockerfile.
- `apps/frontend/*` - frontend source, config, and Dockerfile.
- `services/scrapper/*` - scrapper source, config, and Dockerfile.
- `services/poster/*` - poster source, config, and Dockerfile.
- `packages/shared/*` - shared types/utils package.
- `database/prisma/*` - Prisma schema and migrations.
- `database/src/seed.ts` - seed logic for local/prod bootstrap.
- `docs/*` - architecture, Prisma, env, and deployment documentation.
- `.env.example` files - explicit per-service environment contracts.
- `.dockerignore` - root Docker context exclusions.

## Architecture Decisions (Locked)
- `database/` is not a workspace and not a runtime service; it contains only Prisma assets and scripts.
- PostgreSQL in production is Railway-managed; local Postgres runs via root `docker-compose.yml`.
- Prisma is the single source of truth for schema + migrations.
- Root `devDependencies` contains `prisma`; runtime DB services contain `@prisma/client` (`api`, `scrapper`, `poster`).
- `scrapper` and `poster` are independent deployable services with separate Dockerfiles and entrypoints.
- `scrapper` and `poster` are one-shot cron workers (run job then exit with status code).
- All service Dockerfiles build from repository root context and support npm workspace dependency graph.
- Prisma generation happens during Docker build for DB-using runtime services.
- API includes mandatory `/health` and layered code organization (router/service/repository).
- Frontend is static SPA in production (`vite build` + Nginx); no Node preview runtime.
- Environment variables are explicitly defined per service and documented; local uses `.env`, Railway uses platform vars.
- Frontend environment variables are build-time only.

## Environment Contracts (Locked)
- API (`apps/api`): `PORT`, `DATABASE_URL`.
- Scrapper (`services/scrapper`): `DATABASE_URL`, `TG_BOT_TOKEN`, `TG_CHANNEL_ID`, `SCRAPPER_SOURCE_URL`, `SCRAPPER_USER_AGENT`.
- Poster (`services/poster`): `DATABASE_URL`, `TG_BOT_TOKEN`, `TG_CHANNEL_ID`, `POSTER_BATCH_SIZE`.
- Frontend (`apps/frontend`): `VITE_API_BASE_URL`.

## Testing Strategy (if needed)
- [ ] `npm install` succeeds at root.
- [ ] `npm run build` succeeds for all workspaces (`shared`, `api`, `frontend`, `scrapper`, `poster`).
- [ ] Prisma commands succeed locally: `generate`, `migrate dev`, `db seed`.
- [ ] `docker compose up --build` starts all services and DB locally.
- [ ] API health endpoint responds.
- [ ] Frontend can call API via configured base URL.
- [ ] Workers run as one-shot processes and exit with expected status codes.
- [ ] Service Docker images build from root context and start with expected runtime command.

## Rollback Plan
Revert the monorepo scaffold commit to return to an empty baseline.

## Open Questions
- [ ] Confirm preferred package manager: npm (planned), pnpm, or yarn.
- [ ] Confirm repository remote URL for push step.
- [ ] Confirm Railway service naming conventions/environment variable names.

## Completed
- Date completed: 2026-02-15
- Deviations: Prisma client generation is centralized via root `prisma:generate` and executed in service Docker build stages for DB-backed services.
- Follow-up: finalize git remote URL to complete push to origin.
