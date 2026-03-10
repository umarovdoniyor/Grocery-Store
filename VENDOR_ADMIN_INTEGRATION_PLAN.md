# Vendor/Admin Dashboard Integration Plan (Demo Scope)

Date: 2026-03-10
Status: Draft for execution

## 1) Goals and Scope

### Goals

- Keep only dashboard flows backed by real APIs.
- Remove/hide template-only screens that create dead-end UX.
- Complete a stable demo journey:
  - Customer applies for vendor
  - Admin reviews vendor applications
  - Approved user becomes vendor
  - Vendor sees meaningful dashboard data

### Out of Scope (for this demo iteration)

- Full finance stack (payout accounting, settlements, invoices)
- Ticketing backend (support SLA workflow)
- Refund management engine

## 2) API Inventory (Available Now)

### Auth/Member

- `logIn`, `signUp` (`libs/auth/index.ts`)
- `me`, `getMemberProfile`, `updateMember`, `changeMemberPassword`
- `applyVendor`, `getMyVendorApplication`

### Vendor/Public

- `getVendors`, `getVendorBySlug`, `getVendorProducts` (`libs/vendor/index.ts`)

### Product

- `createProduct`, `updateProduct`, `removeProduct`, `getMyProducts`
- `getProducts`, `getProductById`

### Review

- `getProductReviews`, `getMyProductReview`
- `createProductReview`, `updateProductReview`, `removeProductReview`
- Admin: `getReviewsByAdmin`, `updateReviewStatusByAdmin`

### Admin

- Vendor applications: `getVendorApplicationsByAdmin`, `reviewVendorApplication`
- Orders: `getOrdersByAdmin`, `getOrderByIdByAdmin`, `updateOrderStatusByAdmin`, `cancelOrderByAdmin`
- Products: `getProductsByAdmin`, `getProductByIdByAdmin`, `updateProductStatusByAdmin`, `removeProductByAdmin`
- Categories: `createCategory`, `updateCategory`, `getCategoriesByAdmin`, `removeCategory`
- Members: `getMembersByAdmin`, `updateMemberStatusByAdmin`

## 3) Current Template Areas Still Mock

### Vendor mock-only data source

- `src/utils/services/vendor-dashboard.ts`
- Mock modules currently powering:
  - reviews list (vendor page)
  - support tickets
  - payouts
  - payout requests
  - earning history
  - refund requests

### Admin mock-only data source

- `src/utils/services/admin-dashboard.ts`
- Mock modules currently powering:
  - brands
  - package payments
  - earning history
  - payouts
  - payout requests
  - refund-request panel

## 4) Route Matrix (Keep / Hide / Replace)

### Admin routes

- Keep now (real API-backed)
  - `/admin/orders`
  - `/admin/orders/[id]`
  - `/admin/products`
  - `/admin/categories`
  - `/admin/customers`
  - `/admin/sellers`
- Hide for demo (mock/template-only)
  - `/admin/brands`
  - `/admin/package-payments`
  - `/admin/earning-history`
  - `/admin/payouts`
  - `/admin/payout-requests`
  - `/admin/refund-request`
  - `/admin/refund-setting`
  - `/admin/seller-package`

### Vendor routes

- Keep now
  - `/vendor/dashboard` (already partially moved to live data from `getMyProducts`)
  - `/vendor/account-settings` (UI/settings shell, can map to existing member update)
- Keep but mark limited (needs additional API or fallback strategy)
  - `/vendor/reviews`
- Hide for demo (currently mock/template-only)
  - `/vendor/support-tickets`
  - `/vendor/payouts`
  - `/vendor/payout-requests`
  - `/vendor/payout-settings`
  - `/vendor/refund-request`
  - `/vendor/shop-settings`
  - `/vendor/site-settings`

## 5) Frontend Execution Plan

### Phase A: Navigation and Access Cleanup

- Implement role-based sidebar menus:
  - Admin sees only admin keep-routes
  - Vendor sees only vendor keep-routes
- Remove dead links to hidden routes.
- Add optional lightweight "Coming soon" badge/page for intentionally deferred features.

### Phase B: Vendor Dashboard Hardening

- Keep current cards/stock/recent built from `getMyProducts`.
- Use `getVendorProducts` where storefront-style vendor product list is needed.
- Add robust empty states:
  - No products yet -> CTA to create first product.
- Ensure dashboard widgets gracefully degrade when product API fails.

### Phase C: Vendor Reviews Integration

- Primary path:
  - Use `getVendorProductReviews(input)` (newly added backend API) for `/vendor/reviews`.
- Fallback path (only if needed temporarily):
  - Use `getMyProducts` + `getProductReviews` aggregation.

### Phase D: Admin Stabilization

- Keep API-backed admin screens only.
- Remove mock metrics widgets from admin navigation (can re-add when APIs exist).

### Phase E: Regression

- Validate all role paths and forbidden-route redirects.
- Validate onboarding transitions (PENDING/REJECTED/APPROVED).
- Validate no broken nav links remain.

## 6) New API Requests (Minimum Needed)

### 6.1 Vendor Product Reviews (Required)

Status:

- Implemented by backend (to be verified by frontend integration test).

Reason:

- Vendors need visibility into reviews on their products.

Contract (expected):

- Supports pagination (`page`, `limit`).
- Optional filters (`status`, `search`, `productId`, `rating`).
- Returns `list`, `metaCounter`, and `summary`.

### 6.2 All Other APIs (Deferred)

For this portfolio demo, do not add new backend APIs unless a blocker appears.

Deferred examples:

- `getVendorDashboardSummary`
- `getVendorOrders`
- `getMyVendorProfile` / `updateMyVendorProfile`
- payout/refund/ticket APIs

## 7) Suggested Immediate Next Sprint (1-2 days)

1. Implement role-based filtered sidebar navigation.
2. Hide mock-only routes from nav.
3. Keep admin + vendor screens that are already API-backed.
4. Integrate vendor reviews using `getVendorProductReviews`.
5. Run end-to-end regression checklist.

## 8) Backend Handoff (Actionable)

Current backend ask is only one API:

1. `getVendorProductReviews` (implemented)

No additional API work is required right now for demo delivery.
