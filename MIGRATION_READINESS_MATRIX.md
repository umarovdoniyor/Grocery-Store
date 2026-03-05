# Project Migration Readiness Matrix

_Last updated: 2026-03-05_

## Status Legend

- **Migrated**: Route is already wired to real service layer / GraphQL.
- **Partial**: Some real integration exists, but route/module still depends on template/local/mock providers.
- **Mock/Template**: Route/module still uses `src/utils/__api__/*` with axios mock endpoints or hardcoded/local datasets.
- **Needs API**: No current frontend service contract for this module in `libs/*` / GraphQL layer.

## Domain Matrix

| Domain                   | Routes / Modules                                                                                                                                                                   | Current Data Source                                                        | Status            | Notes                                                                    |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------ | ----- | ---------- | ----------------- | -------------------------------- | ---------------------------------------- |
| Admin Dashboard          | `admin/orders`, `admin/orders/[id]`                                                                                                                                                | `src/utils/services/admin-orders.ts` -> `libs/admin`                       | **Migrated**      | Real data + actions wired                                                |
| Admin Dashboard          | `admin/customers`                                                                                                                                                                  | `src/utils/services/admin-members.ts` -> `libs/admin`                      | **Migrated**      | Member status update wired                                               |
| Admin Dashboard          | `admin/products`                                                                                                                                                                   | `src/utils/services/admin-products.ts` -> `libs/admin`                     | **Migrated**      | Publish/remove actions wired                                             |
| Admin Dashboard          | `admin/sellers`                                                                                                                                                                    | `src/utils/services/admin-vendor-applications.ts` -> `libs/admin`          | **Migrated**      | Approve/reject application wired                                         |
| Admin Dashboard          | `admin/categories`                                                                                                                                                                 | `src/utils/services/admin-categories.ts` -> `libs/admin`                   | **Migrated**      | Category list wired                                                      |
| Admin Dashboard          | `admin/brands`, `admin/products/reviews`, `admin/payouts`, `admin/payout-requests`, `admin/refund-request`, `admin/earning-history`, `admin/package-payments`                      | `utils/__api__/dashboard`                                                  | **Mock/Template** | Not yet moved to dedicated real services                                 |
| Vendor Dashboard         | `vendor/reviews`, `vendor/payout-requests`, `vendor/support-tickets`                                                                                                               | `utils/__api__/vendor`, `utils/__api__/ticket`                             | **Mock/Template** | Requires vendor/ticket service layer mapping                             |
| Vendor Dashboard         | `vendor/payouts`, `vendor/refund-request`, `vendor/earning-history`                                                                                                                | `utils/__api__/dashboard`                                                  | **Mock/Template** | Shares unresolved finance modules                                        |
| Customer Dashboard       | `orders`, `orders/[id]`, `address`, `address/[id]`, `payment-methods`, `payment-methods/[id]`, `profile`, `profile/[id]`, `support-tickets`, `support-tickets/[slug]`, `wish-list` | `utils/**api**/orders                                                      | address           | payments                                                                 | users | ticket     | wish-list`        | **Mock/Template**                | User dashboard still template-data based |
| Storefront (Catalog)     | `/products/search`, `/products/[slug]`, `@modal products/[slug]/view`, `/shops`, `/shops/[slug]`, `/grocery-1/*`                                                                   | `utils/**api**/product-search                                              | products          | related-products                                                         | shop  | grocery-1` | **Mock/Template** | Core browsing & PDP not yet real |
| Checkout Flow            | `(checkout)` layout + checkout data modules                                                                                                                                        | `utils/__api__/layout`, `utils/__api__/checkout`                           | **Partial**       | UI works, data still template constants                                  |
| Shared Layout Data       | root `/`, `/products/layout`, `/shops/layout`, `/order-confirmation/layout`, `/grocery-1/layout`, customer/checkout layouts                                                        | `utils/__api__/layout`                                                     | **Mock/Template** | Global nav/footer/categories should move to real endpoints               |
| Authentication & Session | Login/Register/Profile session components + auth context                                                                                                                           | `src/contexts/AuthContext.tsx`, `libs/auth`, Apollo user queries/mutations | **Partial**       | Core auth real; surrounding profile/dashboard pages still mixed/template |

## Frozen Mock Usage Inventory (Step 2 Snapshot)

### Import counts by `utils/__api__` module

- `dashboard`: 13
- `layout`: 7
- `users`: 3
- `ticket`: 3
- `shop`: 3
- `products`: 3
- `grocery-1`: 3
- `vendor`: 2
- `product-search`: 2
- `payments`: 2
- `orders`: 2
- `address`: 2
- `wish-list`: 1
- `related-products`: 1

### File mapping snapshot (grouped)

- `dashboard`
  - `src/app/(admin-dashboard)/admin/brands/page.tsx`
  - `src/app/(admin-dashboard)/admin/earning-history/page.tsx`
  - `src/app/(admin-dashboard)/admin/package-payments/page.tsx`
  - `src/app/(admin-dashboard)/admin/payout-requests/page.tsx`
  - `src/app/(admin-dashboard)/admin/payouts/page.tsx`
  - `src/app/(admin-dashboard)/admin/products/reviews/page.tsx`
  - `src/app/(admin-dashboard)/admin/refund-request/page.tsx`
  - `src/app/(admin-dashboard)/vendor/earning-history/page.tsx`
  - `src/app/(admin-dashboard)/vendor/payouts/page.tsx`
  - `src/app/(admin-dashboard)/vendor/refund-request/page.tsx`
  - `src/pages-sections/vendor-dashboard/dashboard/page-view/dashboard.tsx`
  - `src/pages-sections/vendor-dashboard/dashboard/recent-purchase.tsx`
  - `src/pages-sections/vendor-dashboard/dashboard/stock-out-products.tsx`
- `layout`
  - `src/app/(checkout)/layout.tsx`
  - `src/app/(customer-dashboard)/layout.tsx`
  - `src/app/grocery-1/layout.tsx`
  - `src/app/order-confirmation/layout.tsx`
  - `src/app/page.tsx`
  - `src/app/products/layout.tsx`
  - `src/app/shops/layout.tsx`
- `users`
  - `src/app/(customer-dashboard)/profile/[id]/page.tsx`
  - `src/app/(customer-dashboard)/profile/page.tsx`
  - `src/pages-sections/customer-dashboard/profile/user-analytics.tsx`
- `ticket`
  - `src/app/(admin-dashboard)/vendor/support-tickets/page.tsx`
  - `src/app/(customer-dashboard)/support-tickets/[slug]/page.tsx`
  - `src/app/(customer-dashboard)/support-tickets/page.tsx`
- `shop`
  - `src/app/shops/[slug]/page.tsx`
  - `src/app/shops/page.tsx`
  - `src/pages-sections/product-details/available-shops/available-shops.tsx`
- `products`
  - `src/app/@modal/(.)products/[slug]/view/page.tsx`
  - `src/app/products/[slug]/page.tsx`
  - `src/pages-sections/product-details/product-reviews/product-reviews.tsx`
- `grocery-1`
  - `src/app/grocery-1/[category]/page.tsx`
  - `src/pages-sections/grocery-1/page-view/grocery-1.tsx`
  - `src/pages-sections/grocery-1/section-2/section-2.tsx`
- `vendor`
  - `src/app/(admin-dashboard)/vendor/payout-requests/page.tsx`
  - `src/app/(admin-dashboard)/vendor/reviews/page.tsx`
- `product-search`
  - `src/app/products/search/page.tsx`
  - `src/app/shops/[slug]/page.tsx`
- `payments`
  - `src/app/(customer-dashboard)/payment-methods/[id]/page.tsx`
  - `src/app/(customer-dashboard)/payment-methods/page.tsx`
- `orders`
  - `src/app/(customer-dashboard)/orders/[id]/page.tsx`
  - `src/app/(customer-dashboard)/orders/page.tsx`
- `address`
  - `src/app/(customer-dashboard)/address/[id]/page.tsx`
  - `src/app/(customer-dashboard)/address/page.tsx`
- `wish-list`
  - `src/app/(customer-dashboard)/wish-list/page.tsx`
- `related-products`
  - `src/app/products/[slug]/page.tsx`

## API Surface Snapshot (Current)

### Real service layer available now

- `libs/admin/index.ts`
  - Categories CRUD/read
  - Products list/detail/status/remove
  - Orders list/detail/status/cancel
  - Members list/status update
  - Vendor applications list/review
- `src/contexts/AuthContext.tsx` + `libs/auth` + Apollo user ops
  - Login/register/me/profile update/change password/vendor apply

### Missing or not yet formalized in service layer

- Vendor finance: payouts, payout requests, earning history
- Refund flows (admin/vendor)
- Reviews moderation/listing paths (admin/vendor)
- Brands management endpoints in frontend service layer
- Customer dashboard resources (orders, addresses, payment methods, tickets, wishlist) as real APIs/services
- Storefront catalog/search/filter/related-products/shop listings as real APIs/services
- Shared layout/homepage data contracts

## Recommended Execution Slices (Step-by-Step)

1. **Freeze mock inventory** (all `src/utils/__api__/*` consumers + classify: axios-mock vs local constants).
2. **Define domain service contracts** for storefront/customer/vendor (same pattern as admin services).
3. **Close backend/API gaps** for finance/refund/reviews/brands + customer/storefront resources.
4. **Migrate storefront critical path**: PLP -> PDP -> related/frequently-bought -> shops listing.
5. **Migrate checkout path**: addresses, delivery slots, payment methods, order placement + confirmation.
6. **Migrate customer dashboard modules**.
7. **Migrate vendor dashboard modules**.
8. **Finish remaining admin modules**.
9. **Disable global mock adapter entirely** and remove dead `__server__` dependencies.
10. **Regression hardening + release checklist**.

## Success Criteria for Full Migration

- No route/page depends on `src/utils/__api__/*` mock/template providers.
- `src/utils/axiosInstance.ts` no longer initializes mock endpoints in production paths.
- All dashboard/storefront/customer/vendor actions use typed service wrappers backed by real GraphQL/API endpoints.
- Build + key user journeys pass smoke tests end-to-end.

## Step 4 Output

- API gap closure checklist: `MIGRATION_API_GAP_CHECKLIST.md`
