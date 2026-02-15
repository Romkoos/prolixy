# Admin Panel

## Purpose / scope
Describe runtime behavior of the frontend admin shell and related API interactions for Dashboard, Settings, and Config sections.

## Where it lives
- Frontend shell and navigation:
  - `apps/frontend/src/app/App.tsx`
  - `apps/frontend/src/widgets/admin-navigation/ui/AdminNavigationLayout.tsx`
- Settings:
  - `apps/frontend/src/pages/settings/ui/SettingsPage.tsx`
  - `apps/frontend/src/app/providers/PreferencesProvider.tsx`
  - `apps/frontend/src/app/i18n.ts`
- Config:
  - `apps/frontend/src/pages/config/ui/ConfigPage.tsx`
  - `apps/frontend/src/api.ts`
- API categories:
  - `apps/api/src/routes/categoryRouter.ts`
  - `apps/api/src/services/categoryService.ts`
  - `apps/api/src/repositories/categoryRepository.ts`

## Step-by-step runtime flow
1. User opens frontend root route (`/`) and sees Dashboard.
2. Navigation is responsive:
   - Mobile: hamburger button opens temporary drawer.
   - Desktop: permanent sidebar is visible.
3. Drawer contains two navigation items:
   - `Settings` (`/settings`)
   - `Config` (`/config`)
4. On Settings:
   - Theme switch toggles MUI palette mode (`light`/`dark`).
   - Language selector switches `en`/`ru`.
   - Both values are persisted in browser local storage.
5. On Config:
   - Frontend loads categories from `GET /categories`.
   - Add/edit uses dialog and submits `POST /categories` or `PUT /categories/:id`.
   - Delete triggers `DELETE /categories/:id`.
   - UI reloads list and shows translated success/error feedback.

## Inputs/outputs and contracts
- Shared DTOs in `packages/shared/src/index.ts` are consumed by both API and frontend:
  - `CategoryDto`
  - `CreateCategoryRequestDto`
  - `UpdateCategoryRequestDto`
  - `CategoryListResponseDto`
  - `CategoryItemResponseDto`
  - `DeleteCategoryResponseDto`
- Article list also uses shared contract:
  - `ArticleListResponseDto`

## Side effects
- `localStorage` writes:
  - `prolixy.theme`
  - `prolixy.language`
- Category CRUD mutates PostgreSQL `Category` table through API.

## Edge cases & failure modes
- Empty names are blocked in UI and validated again by API.
- API returns:
  - `400` for invalid payloads
  - `404` when category does not exist
  - `409` for case-insensitive duplicate names
- Frontend shows actionable error message from API when available.

## Extension points
- Add new navigation sections in `AdminNavigationLayout`.
- Add new translation keys in `app/i18n.ts`.
- Add extra category fields in shared DTOs first, then API repository/service/router, then frontend forms.

## Related docs
- `docs/Overview.md`
- `docs/EnvironmentContracts.md`
- `docs/DockerBuildStrategy.md`
