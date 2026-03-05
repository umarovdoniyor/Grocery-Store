# Migration Service Contracts (Step 3)

_Last updated: 2026-03-05_

This document defines the frontend service contracts to replace all `src/utils/__api__/*` usage with typed, real-data service modules.

## Contract Rules

- All page/client components should depend on `src/utils/services/*` only.
- Service modules should depend on `libs/*` (GraphQL/API) only.
- Return shape convention:
  - `Promise<{ success: boolean; data?: T; error?: string; meta?: M }>`
- No UI models in `libs/*`; map DTO -> UI row/item in `src/utils/services/*`.

## Existing Real Providers (Already Available)

- `libs/admin/index.ts`
- `libs/auth/index.ts`
- `libs/product/index.ts`
- `libs/category/index.ts`

## New Service Modules To Implement

### 1) Storefront Catalog Service

**File:** `src/utils/services/storefront-catalog.ts`

```ts
export interface CatalogFilters {
  categories: { id: string; name: string; slug: string }[];
  brands: string[];
  priceRange: { min: number; max: number };
}

export interface CatalogProductCard {
  id: string;
  slug: string;
  title: string;
  thumbnail: string;
  price: number;
  salePrice?: number;
  inStock: boolean;
  rating?: number;
  shopName?: string;
}

export interface CatalogQuery {
  page: number;
  limit: number;
  search?: string;
  categoryIds?: string[];
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: "NEWEST" | "PRICE_ASC" | "PRICE_DESC" | "POPULAR";
}

export async function getCatalogFilters(): Promise<{
  success: boolean;
  data?: CatalogFilters;
  error?: string;
}>;
export async function getCatalogProducts(input: CatalogQuery): Promise<{
  success: boolean;
  data?: CatalogProductCard[];
  meta?: { total: number; page: number; limit: number };
  error?: string;
}>;
export async function getSearchSuggestions(
  keyword: string,
  limit?: number
): Promise<{ success: boolean; data?: string[]; error?: string }>;
```

**Primary backend dependency:** `libs/product`, `libs/category`

---

### 2) Product Details Service

**File:** `src/utils/services/product-details.ts`

```ts
export interface ProductDetails {
  id: string;
  slug: string;
  title: string;
  description: string;
  images: string[];
  thumbnail: string;
  price: number;
  salePrice?: number;
  stockQty: number;
  brand?: string;
  sku?: string;
  unit: string;
  likes: number;
  views: number;
  vendor?: { id: string; name: string; avatar?: string };
}

export interface ProductReviewItem {
  id: string;
  rating: number;
  comment: string;
  authorName: string;
  createdAt: string;
}

export async function getProductDetailsBySlug(
  slug: string
): Promise<{ success: boolean; data?: ProductDetails; error?: string }>;
export async function getRelatedProductCards(
  productId: string,
  limit?: number
): Promise<{ success: boolean; data?: CatalogProductCard[]; error?: string }>;
export async function getFrequentlyBoughtTogether(
  productId: string,
  limit?: number
): Promise<{ success: boolean; data?: CatalogProductCard[]; error?: string }>;
export async function getProductReviews(
  productId: string,
  page: number,
  limit: number
): Promise<{
  success: boolean;
  data?: ProductReviewItem[];
  meta?: { total: number; page: number; limit: number };
  error?: string;
}>;
```

**Primary backend dependency:** `libs/product` (+ review API gap)

---

### 3) Checkout Service

**File:** `src/utils/services/checkout.ts`

```ts
export interface CheckoutAddress {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface DeliverySlot {
  id: string;
  label: string;
  startAt: string;
  endAt: string;
}

export interface PaymentMethod {
  id: string;
  type: "CARD" | "PAYPAL" | "COD";
  label: string;
  last4?: string;
  isDefault?: boolean;
}

export interface PlaceOrderInput {
  addressId: string;
  paymentMethodId: string;
  deliverySlotId?: string;
  note?: string;
}

export async function getCheckoutAddresses(): Promise<{
  success: boolean;
  data?: CheckoutAddress[];
  error?: string;
}>;
export async function getDeliverySlots(): Promise<{
  success: boolean;
  data?: DeliverySlot[];
  error?: string;
}>;
export async function getCheckoutPaymentMethods(): Promise<{
  success: boolean;
  data?: PaymentMethod[];
  error?: string;
}>;
export async function placeOrder(
  input: PlaceOrderInput
): Promise<{ success: boolean; data?: { orderId: string; orderNo: string }; error?: string }>;
```

**Primary backend dependency:** order/address/payment APIs needed

---

### 4) Customer Dashboard Service

**File:** `src/utils/services/customer-dashboard.ts`

```ts
export async function getCustomerOrders(
  page: number,
  limit: number
): Promise<{ success: boolean; data?: OrderListItem[]; meta?: { total: number }; error?: string }>;
export async function getCustomerOrderById(
  orderId: string
): Promise<{ success: boolean; data?: OrderDetails; error?: string }>;
export async function getCustomerAddresses(): Promise<{
  success: boolean;
  data?: CheckoutAddress[];
  error?: string;
}>;
export async function upsertCustomerAddress(
  input: AddressUpsertInput
): Promise<{ success: boolean; data?: { addressId: string }; error?: string }>;
export async function removeCustomerAddress(
  addressId: string
): Promise<{ success: boolean; error?: string }>;
export async function getCustomerPaymentMethods(
  page: number,
  limit: number
): Promise<{ success: boolean; data?: PaymentMethod[]; meta?: { total: number }; error?: string }>;
export async function getCustomerTickets(
  page: number,
  limit: number
): Promise<{ success: boolean; data?: TicketItem[]; meta?: { total: number }; error?: string }>;
export async function getCustomerWishlist(
  page: number,
  limit: number
): Promise<{
  success: boolean;
  data?: CatalogProductCard[];
  meta?: { total: number };
  error?: string;
}>;
```

**Primary backend dependency:** customer orders/address/payment/ticket/wishlist APIs needed

---

### 5) Vendor Dashboard Service

**File:** `src/utils/services/vendor-dashboard.ts`

```ts
export async function getVendorPayouts(
  page: number,
  limit: number
): Promise<{
  success: boolean;
  data?: VendorPayoutItem[];
  meta?: { total: number };
  error?: string;
}>;
export async function getVendorPayoutRequests(
  page: number,
  limit: number
): Promise<{
  success: boolean;
  data?: VendorPayoutRequestItem[];
  meta?: { total: number };
  error?: string;
}>;
export async function createVendorPayoutRequest(input: {
  amount: number;
  note?: string;
}): Promise<{ success: boolean; data?: { requestId: string }; error?: string }>;
export async function getVendorRefundRequests(
  page: number,
  limit: number
): Promise<{
  success: boolean;
  data?: VendorRefundItem[];
  meta?: { total: number };
  error?: string;
}>;
export async function getVendorReviews(
  page: number,
  limit: number
): Promise<{
  success: boolean;
  data?: VendorReviewItem[];
  meta?: { total: number };
  error?: string;
}>;
export async function getVendorTickets(
  page: number,
  limit: number
): Promise<{ success: boolean; data?: TicketItem[]; meta?: { total: number }; error?: string }>;
```

**Primary backend dependency:** vendor finance/refund/reviews/tickets APIs needed

---

### 6) Admin Extended Service (Remaining Admin Pages)

**File:** `src/utils/services/admin-finance.ts` and `src/utils/services/admin-moderation.ts`

```ts
export async function getAdminPayouts(
  page: number,
  limit: number
): Promise<{
  success: boolean;
  data?: AdminPayoutItem[];
  meta?: { total: number };
  error?: string;
}>;
export async function getAdminPayoutRequests(
  page: number,
  limit: number
): Promise<{
  success: boolean;
  data?: AdminPayoutRequestItem[];
  meta?: { total: number };
  error?: string;
}>;
export async function getAdminRefundRequests(
  page: number,
  limit: number
): Promise<{
  success: boolean;
  data?: AdminRefundItem[];
  meta?: { total: number };
  error?: string;
}>;
export async function getAdminEarningHistory(
  page: number,
  limit: number
): Promise<{
  success: boolean;
  data?: AdminEarningItem[];
  meta?: { total: number };
  error?: string;
}>;
export async function getAdminPackagePayments(
  page: number,
  limit: number
): Promise<{
  success: boolean;
  data?: AdminPackagePaymentItem[];
  meta?: { total: number };
  error?: string;
}>;
export async function getAdminBrands(
  page: number,
  limit: number,
  search?: string
): Promise<{ success: boolean; data?: AdminBrandItem[]; meta?: { total: number }; error?: string }>;
export async function getAdminProductReviews(
  page: number,
  limit: number
): Promise<{
  success: boolean;
  data?: ProductReviewItem[];
  meta?: { total: number };
  error?: string;
}>;
```

**Primary backend dependency:** admin finance/reviews/brands APIs needed

---

### 7) Shared Layout Service

**File:** `src/utils/services/layout-data.ts`

```ts
export interface LayoutData {
  topCategories: { id: string; name: string; slug: string }[];
  megaMenu: unknown[];
  footerLinks: unknown[];
  promoBanners?: unknown[];
}

export async function getLayoutData(): Promise<{
  success: boolean;
  data?: LayoutData;
  error?: string;
}>;
```

**Primary backend dependency:** layout/nav/footer endpoint needed (or compose from existing category/shop APIs)

## API Gap Handoff (for Step 4)

Backend/API work should expose these route-level capabilities before UI migration slices:

- Storefront filters + product listing/query metadata
- Product reviews read endpoint
- Shop list/detail endpoint contracts
- Customer orders/address/payment/ticket/wishlist APIs
- Vendor finance/refund/review/ticket APIs
- Admin finance/review/brand endpoints
- Shared layout content endpoint
