"use client";

import dynamic from "next/dynamic";

const CreateCategoryPageView = dynamic(
  () => import("pages-sections/vendor-dashboard/categories/page-view/create-category"),
  {
    loading: () => null,
    ssr: false
  }
);

export default function CreateCategoryPageClient() {
  return <CreateCategoryPageView />;
}
