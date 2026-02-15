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
2. `api` exposes `/health`, `/articles`, and `/categories` CRUD endpoints.
3. `frontend` calls `api` through `VITE_API_BASE_URL`.
4. Frontend renders an admin shell with responsive navigation (`Dashboard`, `Settings`, `Config`):
   - `Dashboard` is currently informational/empty.
   - `Settings` controls persisted theme (`light`/`dark`) and language (`en`/`ru`).
   - `Config` manages categories (create, edit, delete) against `/categories`.
5. `poster` reads unpublished rows and marks them as posted.

## Categories flow (Config page)
### Purpose / scope
Enable manual category lifecycle management for admin users.

### Where it lives
- API:
  - `apps/api/src/routes/categoryRouter.ts`
  - `apps/api/src/services/categoryService.ts`
  - `apps/api/src/repositories/categoryRepository.ts`
- Frontend:
  - `apps/frontend/src/pages/config/ui/ConfigPage.tsx`
  - `apps/frontend/src/api.ts`
- Shared contracts:
  - `packages/shared/src/index.ts`

### Step-by-step runtime flow
1. Frontend loads the Config page and calls `GET /categories`.
2. API returns categories sorted by name.
3. Add/Edit action opens a dialog and sends:
   - `POST /categories` for create
   - `PUT /categories/:id` for update
4. Delete action sends `DELETE /categories/:id`.
5. Frontend reloads list and displays translated success/error feedback.

### Inputs/outputs
- Input payloads:
  - `CreateCategoryRequestDto` (`name`)
  - `UpdateCategoryRequestDto` (`name`)
- Output payloads:
  - `CategoryListResponseDto`
  - `CategoryItemResponseDto`
  - `DeleteCategoryResponseDto`

### Side effects
- Writes/updates/deletes rows in PostgreSQL `Category` table.
- Updates UI list state and feedback alerts in Config page.

### Edge cases and failure modes
- Empty/too-long category names are rejected by API validation (`400`).
- Case-insensitive duplicate names are rejected (`409`).
- Missing category id on update/delete returns not found (`404`).

## Settings flow (Theme + language)
### Purpose / scope
Persist admin presentation preferences locally in browser storage.

### Where it lives
- `apps/frontend/src/app/providers/PreferencesProvider.tsx`
- `apps/frontend/src/app/i18n.ts`
- `apps/frontend/src/pages/settings/ui/SettingsPage.tsx`

### Runtime behavior
- Theme mode and language are loaded from `localStorage` keys:
  - `prolixy.theme`
  - `prolixy.language`
- Theme is applied through MUI `ThemeProvider` palette mode.
- Language is applied through `react-i18next` with `en` and `ru` resources.

## Deployment model
- `api`, `frontend`, `scrapper`, and `poster` are separate Railway services.
- PostgreSQL is Railway-managed in production.
- Local PostgreSQL is provided by `docker-compose.yml`.
