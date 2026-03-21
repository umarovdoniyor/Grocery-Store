"use client";

import dynamic from "next/dynamic";

const ProductsClient = dynamic(() => import("./products-client"), {
  loading: () => null,
  ssr: false
});

export default function ProductsPageClient() {
  return <ProductsClient />;
}