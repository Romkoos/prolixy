# Docker Build Strategy

## Purpose / scope
Define a fixed Docker build strategy for all deployable services in this monorepo.

## Where it lives
- `apps/api/Dockerfile`
- `apps/frontend/Dockerfile`
- `services/scrapper/Dockerfile`
- `services/poster/Dockerfile`
- `.dockerignore`

## Locked build sequence (workspace services)
For `api`, `scrapper`, and `poster`:
1. Build context is repository root (`.`).
2. `npm ci` is executed at root using `package-lock.json`.
3. Build shared package first: `npm run build -w packages/shared`.
4. Generate Prisma client: `npm run prisma:generate`.
5. Build the target workspace: `npm run build -w <workspace>`.
6. Runtime image runs `npm ci --omit=dev`, then copies only needed runtime artifacts:
   - root `node_modules`
   - target workspace `dist` + `package.json`
   - `packages/shared/dist` + `packages/shared/package.json`
   - Prisma schema folder required by generated client/runtime
7. Start command runs the built entrypoint.

## Locked build sequence (frontend SPA)
1. Build context is repository root (`.`).
2. `npm ci` at root.
3. `npm run build -w apps/frontend` (Vite build).
4. Runtime image is Nginx only.
5. Copy `apps/frontend/dist` to `/usr/share/nginx/html`.
6. No Node preview server in production.

## Production dependency policy
- Runtime stages install production dependencies only (`npm ci --omit=dev`).
- Build stages may use dev dependencies.

## Side effects
- Prisma client generation depends on `DATABASE_URL` for some operations; generation itself does not need DB connectivity.
- Build-time frontend env injection depends on `VITE_API_BASE_URL` passed as build arg/env.
