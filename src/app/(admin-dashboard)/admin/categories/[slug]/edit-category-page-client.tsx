"use client";

import dynamic from "next/dynamic";

const EditCategoryPageView = dynamic(
  () => import("pages-sections/vendor-dashboard/categories/page-view/category-edit"),
  {
    loading: () => null,
    ssr: false
  }
);

export default function EditCategoryPageClient() {
  return <EditCategoryPageView />;
}