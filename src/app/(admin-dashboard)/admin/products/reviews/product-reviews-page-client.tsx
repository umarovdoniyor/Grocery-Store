"use client";

import dynamic from "next/dynamic";

const ProductReviewsPageView = dynamic(
  () => import("pages-sections/vendor-dashboard/products/page-view/product-reviews"),
  {
    loading: () => null,
    ssr: false
  }
);

export default function ProductReviewsPageClient() {
  return <ProductReviewsPageView uiMode="admin" />;
}
