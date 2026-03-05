# API Gap Checklist (Step 4)

_Last updated: 2026-03-05_

This checklist closes Step 4 by mapping each migration area to:

1. **Already available in Apollo operations** (frontend wiring gap)
2. **Missing in Apollo operations** (backend/API gap)
3. **Action owner** and **priority**

## 1) Operation Inventory Summary

### Already available (Apollo user)

- Auth/member: `ME`, `GET_MEMBER_PROFILE`, `SIGN_UP`, `LOGIN`, `UPDATE_MEMBER`, `CHANGE_MEMBER_PASSWORD`
- Catalog/product: `GET_PRODUCTS`, `GET_PRODUCT_BY_ID`, `GET_FEATURED_PRODUCTS`, `GET_RELATED_PRODUCTS`, `SEARCH_SUGGESTIONS`
- Categories: `GET_CATEGORIES`, `GET_CATEGORY_BY_ID`, `GET_CATEGORY_BY_SLUG`
- Cart/checkout/order: `GET_MY_CART`, `GET_CHECKOUT_SUMMARY`, `GET_MY_ORDERS`, `GET_MY_ORDER_BY_ID`, `ADD_TO_CART`, `UPDATE_CART_ITEM_QTY`, `REMOVE_CART_ITEM`, `CLEAR_CART`, `VALIDATE_CART_FOR_CHECKOUT`, `CREATE_ORDER_FROM_CART`, `CANCEL_MY_ORDER`

### Already available (Apollo admin)

- Admin core: categories/products/orders/members + vendor applications (already migrated routes)
- Operations include: `GET_MEMBERS_BY_ADMIN`, `GET_PRODUCTS_BY_ADMIN`, `GET_ORDERS_BY_ADMIN`, `GET_ORDER_BY_ID_BY_ADMIN`, `GET_VENDOR_APPLICATIONS_BY_ADMIN` and related admin mutations

### Confirmed missing in Apollo (current files)

- No dedicated customer address CRUD operations
- No dedicated customer payment-method operations
- No customer support ticket operations
- No customer wishlist operations
- No vendor payouts / payout-requests / earning-history operations
- No vendor refund-request operations
- No vendor reviews list operations
- No admin payouts / payout-requests / earning-history / package-payments operations
- No admin product-reviews moderation operations
- No admin brands operations
- No shared layout/nav/footer content operation

## 2) Gap Closure Backlog (Prioritized)

## P0 — Critical user journey

### A. Storefront browse/search/product details

- **Status:** Mostly available in Apollo user ops.
- **Gap type:** Frontend wiring gap.
- **Actions:**
  - Create `libs/catalog` or expand `libs/product` wrappers for `GET_PRODUCTS`, `SEARCH_SUGGESTIONS`, `GET_RELATED_PRODUCTS`.
  - Create `src/utils/services/storefront-catalog.ts` and `src/utils/services/product-details.ts` mappers.
  - Replace `utils/__api__/product-search`, `utils/__api__/products`, `utils/__api__/related-products`, `utils/__api__/shop` usage route-by-route.
- **Owner:** Frontend.

### B. Cart + checkout

- **Status:** Core cart/order operations exist.
- **Gap type:** Mixed (frontend wiring + partial API missing for address/payment methods).
- **Actions:**
  - Create `libs/checkout` wrappers around existing cart/order ops.
  - Implement `src/utils/services/checkout.ts`.
  - Add backend operations for addresses/payment methods if checkout requires separate saved entities beyond member profile fields.
- **Owner:** Frontend + Backend (for address/payment entities).

## P1 — Customer dashboard

### C. Orders module

- **Status:** Available via `GET_MY_ORDERS`, `GET_MY_ORDER_BY_ID`, `CANCEL_MY_ORDER`.
- **Gap type:** Frontend wiring gap.
- **Actions:**
  - Create `libs/customer-orders` wrapper.
  - Implement `src/utils/services/customer-dashboard.ts` order adapters.
  - Replace `utils/__api__/orders` in customer routes.
- **Owner:** Frontend.

### D. Address / payment methods / tickets / wishlist

- **Status:** Missing dedicated operations.
- **Gap type:** Backend/API gap.
- **Actions:**
  - Add user GraphQL operations for address CRUD.
  - Add payment methods list/detail/create/update/delete/default set.
  - Add support ticket list/detail/create/reply.
  - Add wishlist list/add/remove.
  - Then add libs wrappers + service adapters and migrate routes.
- **Owner:** Backend first, then Frontend.

## P2 — Vendor dashboard

### E. Vendor finance + tickets + reviews

- **Status:** Missing dedicated vendor operations.
- **Gap type:** Backend/API gap.
- **Actions:**
  - Add vendor payouts, payout requests, earning history operations.
  - Add vendor refund request operations.
  - Add vendor reviews operations.
  - Add vendor ticket operations if separate from customer ticket model.
  - Then create `libs/vendor-dashboard` + `src/utils/services/vendor-dashboard.ts` and migrate pages.
- **Owner:** Backend first, then Frontend.

## P2 — Remaining admin modules

### F. Admin finance/reviews/brands

- **Status:** Missing dedicated admin operations in current Apollo admin files.
- **Gap type:** Backend/API gap.
- **Actions:**
  - Add admin payouts / payout requests / earning history / package payments queries.
  - Add admin product reviews moderation queries/mutations.
  - Add admin brands queries/mutations.
  - Create `src/utils/services/admin-finance.ts`, `src/utils/services/admin-moderation.ts` and migrate remaining admin pages.
- **Owner:** Backend first, then Frontend.

## P3 — Shared layout data

### G. Layout/nav/footer/home composition

- **Status:** No explicit layout content contract.
- **Gap type:** API design gap.
- **Actions:**
  - Define `getLayoutData` contract (categories, menus, footer, promo blocks).
  - Implement backend resolver(s) or compose from existing services.
  - Replace `utils/__api__/layout` across layouts.
- **Owner:** Backend + Frontend.

## 3) Concrete files to update for API addition

### Apollo files

- `apollo/user/query.ts`
- `apollo/user/mutation.ts`
- `apollo/admin/query.ts`
- `apollo/admin/mutation.ts`

### Frontend libs to add (recommended)

- `libs/customer/index.ts` (orders/address/payment/wishlist/tickets)
- `libs/vendor/index.ts` (finance/refund/reviews/tickets)
- `libs/checkout/index.ts` (cart + checkout orchestration)
- `libs/layout/index.ts` (layout content)

### Frontend service adapters to add

- `src/utils/services/storefront-catalog.ts`
- `src/utils/services/product-details.ts`
- `src/utils/services/checkout.ts`
- `src/utils/services/customer-dashboard.ts`
- `src/utils/services/vendor-dashboard.ts`
- `src/utils/services/admin-finance.ts`
- `src/utils/services/admin-moderation.ts`
- `src/utils/services/layout-data.ts`

## 4) Definition of Done for Step 4

- Every `Mock/Template` area in readiness matrix is mapped to either:
  - existing Apollo operation(s) (frontend wiring backlog), or
  - missing Apollo operation(s) (backend backlog).
- Each missing area has owner + priority and target files identified.

Step 4 is considered complete with this document.
