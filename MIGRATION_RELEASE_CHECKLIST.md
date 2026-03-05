# Migration Release Checklist

_Last updated: 2026-03-05_

## Scope

- Service-layer migration completed for admin, vendor, customer, storefront, and checkout route consumers.
- Global mock bootstrap is now disabled by default in `src/utils/axiosInstance.ts`.
- `utils/__api__/*` imports are removed from app/page-section runtime paths.

## Pre-Release Gates

- [x] Production build passes (`npm run build`).
- [x] Scoped lint for migrated areas passes (`npx eslint src/app src/pages-sections src/utils/services src/utils/axiosInstance.ts`).
- [x] Formatting passes (`npm run format:check`).
- [ ] Confirm environment variables in deployment platform:
  - `NEXT_PUBLIC_ENABLE_MOCKS` is unset or `false`.
  - `NEXT_PUBLIC_ENABLE_DASHBOARD_MOCKS` is unset or `false`.
- [ ] Validate production API endpoints and auth tokens are configured.

## Known Baseline Issues (Out of Migration Scope)

- Full-repo lint reports existing legacy issues in `apollo/client.ts` (`@ts-ignore` usage) and one hook warning in `src/hooks/useProtectedRoute.ts`.
- Next.js 16 no longer accepts current `next lint` script behavior in this setup; use `npx eslint .` (or scoped variant) for CI until script is updated.

## Deployment Plan

1. Deploy to staging with mocks disabled.
2. Run smoke flows on staging:
   - Home/grocery browse/search/product details.
   - Cart -> checkout -> payment -> order confirmation.
   - Customer dashboard (orders, addresses, payments, tickets, wishlist).
   - Vendor dashboard (support tickets, reviews, payouts, payout requests, refunds, earnings).
   - Admin dashboard modules (brands, reviews, payouts, payout requests, refunds, earnings, package payments).
3. Validate no network calls target legacy `/api/*` mock endpoints unexpectedly.
4. Promote same build artifact to production.

## Rollback Plan

1. Revert to previous deployment artifact.
2. If hotfix needed before full rollback, temporarily enable mocks via `NEXT_PUBLIC_ENABLE_MOCKS=true` in non-production environments only.
3. Re-run smoke checks and capture failing route/service bindings.

## Post-Release Verification

- [ ] Monitor 4xx/5xx error rate for migrated routes.
- [ ] Monitor checkout and order completion funnel.
- [ ] Confirm admin/vendor/customer dashboard pages render with live data.
- [ ] Confirm no regression in authentication and role-protected routes.
