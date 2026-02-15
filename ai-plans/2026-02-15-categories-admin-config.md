# Task: Categories Admin Config (CRUD + Settings + Responsive UI)

## Context
- Ticket/Request: Add category creation, update, deletion, and management UI with Settings and Config pages.
- Related docs: `docs/Overview.md`, `docs/README.md`, `docs/EnvironmentContracts.md`.

## Objective
Implement end-to-end category management for the admin panel with a responsive frontend (mobile-first), dark/light theme support, English/Russian localization, and API endpoints for category CRUD. Keep shared contracts in `packages/shared`.

## Technical Approach
Use Material UI for an admin-oriented responsive component system (app bar, drawer, forms, data list/dialogs) with custom light/dark themes. Add React Router for page navigation and `react-i18next` for English/Russian translations. Introduce category contracts in `packages/shared`, add Prisma `Category` model with migration, and wire new API repository/service/router layers aligned with the existing API architecture.

## Implementation Steps
- [x] Step 1: Add and export shared category contracts in `packages/shared` (DTOs, request payload types, helpers if needed).
- [x] Step 2: Extend Prisma schema with `Category` model and generate migration/client artifacts.
- [x] Step 3: Implement API category repository/service/router and mount endpoints under `/categories` with validation and error handling.
- [x] Step 4: Add frontend dependencies and scaffold app shell with responsive hamburger navigation (Dashboard, Settings, Config).
- [x] Step 5: Implement Settings page with theme toggle and language switcher persisted in local storage.
- [x] Step 6: Implement Config page category list with add/edit/delete flows connected to API.
- [x] Step 7: Update frontend runtime contracts and ensure all shared interfaces/types are consumed from `packages/shared`.
- [x] Step 8: Update docs in `docs/` (overview/runtime behavior + new API/UI flows, include diagram if helpful).
- [x] Step 9: Run validation (`npm run build`, lint/type checks where available), fix issues, finalize plan checklist and completion notes.

## Files to Modify/Create
- `packages/shared/src/index.ts` - shared category types/interfaces and exports.
- `database/prisma/schema.prisma` - `Category` model.
- `database/prisma/migrations/*` - new migration for categories table.
- `apps/api/src/repositories/categoryRepository.ts` - category persistence layer.
- `apps/api/src/services/categoryService.ts` - category business/validation logic.
- `apps/api/src/routes/categoryRouter.ts` - category CRUD endpoints.
- `apps/api/src/routes/index.ts` - mount category routes.
- `apps/api/src/app.ts` - wire category dependencies.
- `apps/frontend/package.json` - UI/router/i18n dependencies.
- `apps/frontend/src/*` - app shell, pages, API client, i18n, theme, responsive menu.
- `docs/Overview.md` and/or topic docs - runtime and UX flow updates.
- `docs/README.md` - reading order/link updates if new docs are added.

## Testing Strategy (if needed)
- [x] Build shared package and ensure API/frontend compile with shared types.
- [ ] Validate API endpoints: list/create/update/delete categories (success + invalid payload + not found).
- [ ] Verify responsive layout on mobile width and desktop width.
- [ ] Verify theme toggle changes palette and persists on reload.
- [ ] Verify language switch (EN/RU) updates visible UI text and persists on reload.
- [ ] Verify category CRUD actions update UI state and reflect server data.

## Rollback Plan
Revert this task branch commits to return to the previous baseline without category/admin functionality.

## Open Questions
- [x] Confirm whether category name uniqueness should be case-insensitive (resolved: use case-insensitive uniqueness in service validation).
- [x] Confirm if Config page should include pagination for categories (resolved: no pagination initially).

## Completed
- Date completed: 2026-02-15
- Deviations: Prisma migration SQL for categories was created manually because `prisma migrate dev` encountered a persistent advisory lock timeout in local Postgres, while schema validation and Prisma client generation succeeded.
- Follow-up items:
  - Run manual UI QA for mobile and desktop navigation behavior.
  - Run manual API smoke tests for category CRUD status codes and error contracts.
  - Consider suppressing non-fatal Vite `use client` warnings from third-party packages in future frontend tooling cleanup.
