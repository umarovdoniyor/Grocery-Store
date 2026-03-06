# Real Data Integration TODO (Pre-Deployment)

_Last updated: 2026-03-06_

## Goal

Make the app fully presentable with real backend data before deployment.

## Current Reality Snapshot

- `grocery-home` is now migrated to real product/category APIs.
- Remaining template/mock usage is still present in service modules:
  - `src/utils/services/layout-data.ts`
  - `src/utils/services/shop-directory.ts`
  - `src/utils/services/customer-dashboard.ts` (tickets/messages parts)
  - `src/utils/services/vendor-dashboard.ts`
  - `src/utils/services/admin-dashboard.ts`
- `src/utils/__api__/*` still exists in the repo (legacy), but should not be used by active routes after migration.

## Working Rules (for each phase)

1. Wire service layer to real API first.
2. Keep existing UI contracts stable (minimal component changes).
3. Run smoke tests for that phase only.
4. Commit phase in a clean, small commit.
5. Move to next phase.

## Phase 0: Baseline and Safety

- [ ] Confirm env for real backend in `.env.local`:
  - `NEXT_PUBLIC_API_GRAPHQL_URL=http://localhost:3007/graphql`
  - `NEXT_PUBLIC_ENABLE_MOCKS=false`
  - `NEXT_PUBLIC_ENABLE_DASHBOARD_MOCKS=false`
- [ ] Ensure no stale `next dev` process lock before testing.
- [ ] Capture baseline:
  - `npm run build`
  - `npx eslint src/utils/services src/app src/pages-sections`

Acceptance:

- Build passes.
- App runs on local and can login with real backend.

## Phase 1: Storefront and Layout (Public-facing first)

### 1A. Shared Layout Data

- [x] Migrate `src/utils/services/layout-data.ts` to real API-backed data.
- [x] Remove `__server__/__db__/layout` dependency from active runtime paths.

Routes to test:

- [ ] `/`
- [ ] `/products`
- [ ] `/shops`
- [ ] `/order-confirmation`
- [ ] `/grocery-1`

Acceptance:

- Header/footer/nav/categories render from backend-compatible sources (or approved static fallback if no API exists).

### 1B. Shops Directory

- [x] Migrate `src/utils/services/shop-directory.ts` to real API-backed shop/product data.

Routes to test:

- [ ] `/shops`
- [ ] `/shops/[slug]`

Acceptance:

- Shop list/details and shop product lists reflect backend records.

### 1C. Product Browsing and Details Regression

- [ ] Re-test already migrated product paths with real backend.

Routes to test:

- [ ] `/products/search`
- [ ] `/products/[slug]`
- [ ] `@modal /products/[slug]/view`
- [ ] `/grocery-1`
- [ ] `/grocery-1/[category]`

Acceptance:

- Product counts, cards, and details are consistent with DB.

## Phase 2: Checkout + Customer Core Journeys

### 2A. Cart/Checkout Integration Validation

- [ ] Validate cart read/update/remove flow with real APIs.
- [ ] Validate checkout summary, place order, and order confirmation.

Routes to test:

- [ ] `/cart`
- [ ] `/checkout`
- [ ] `/order-confirmation`

Acceptance:

- Order can be placed end-to-end with real backend data.

### 2B. Customer Dashboard Modules

- [ ] Orders and order detail
- [ ] Addresses and address detail
- [ ] Payment methods and payment method detail
- [ ] Profile and profile detail
- [ ] Support tickets and ticket detail
- [ ] Wishlist (already migrated, re-verify)

Routes to test:

- [ ] `/orders`
- [ ] `/orders/[id]`
- [ ] `/address`
- [ ] `/address/[id]`
- [ ] `/payment-methods`
- [ ] `/payment-methods/[id]`
- [ ] `/profile`
- [ ] `/profile/[id]`
- [ ] `/support-tickets`
- [ ] `/support-tickets/[slug]`
- [ ] `/wish-list`

Acceptance:

- All customer dashboard pages render with real data and actions persist.

## Phase 3: Vendor Dashboard

- [ ] Migrate `src/utils/services/vendor-dashboard.ts` from `__server__` datasets.
- [ ] Wire vendor tickets/reviews/payout/refund/earning modules to real APIs.

Routes to test:

- [ ] `/vendor/dashboard`
- [ ] `/vendor/reviews`
- [ ] `/vendor/support-tickets`
- [ ] `/vendor/payouts`
- [ ] `/vendor/payout-requests`
- [ ] `/vendor/refund-request`
- [ ] `/vendor/earning-history`

Acceptance:

- Vendor KPIs/lists/actions reflect backend state.

## Phase 4: Admin Remaining Modules

- [ ] Migrate `src/utils/services/admin-dashboard.ts` from `__server__` datasets.
- [ ] Wire brands/reviews/payout/payout-request/refund/earnings/package-payments to real APIs.

Routes to test:

- [ ] `/admin/brands`
- [ ] `/admin/products/reviews`
- [ ] `/admin/payouts`
- [ ] `/admin/payout-requests`
- [ ] `/admin/refund-request`
- [ ] `/admin/earning-history`
- [ ] `/admin/package-payments`

Acceptance:

- Admin pages use real data sources only.

## Phase 5: Hard Cutover and Cleanup

- [ ] Confirm active runtime imports no longer reference `src/utils/__api__/*`.
- [ ] Confirm active service layer no longer imports `__server__/__db__/*`.
- [ ] Keep mocks disabled in all deployment envs.
- [ ] Optional cleanup: remove dead mock modules after final verification.

Acceptance:

- Real-data-only runtime for all presentable flows.

## Test Script (repeat per phase)

1. `npm run build`
2. `npx eslint src/utils/services src/app src/pages-sections`
3. Manual smoke tests for phase routes.
4. Save screenshots for key routes (home, PLP, PDP, checkout, dashboards).

## Commit Strategy

- Commit 1: Service/API wiring for a single domain.
- Commit 2: Route/page updates for that domain.
- Commit 3: Fixes and regression patches.

Suggested commit format:

- `feat(storefront): migrate layout/shop data to real API`
- `feat(customer): migrate ticket/address/payment modules`
- `feat(vendor): replace dashboard mock datasets`
- `feat(admin): migrate remaining finance/review modules`
- `chore(cleanup): remove runtime mock dependencies`
