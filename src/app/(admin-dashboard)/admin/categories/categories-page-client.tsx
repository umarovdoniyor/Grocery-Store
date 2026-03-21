"use client";

import dynamic from "next/dynamic";

const CategoriesClient = dynamic(() => import("./categories-client"), {
  loading: () => null,
  ssr: false
});

export default function CategoriesPageClient() {
  return <CategoriesClient />;
}
