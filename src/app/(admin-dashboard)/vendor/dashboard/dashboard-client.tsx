"use client";

import dynamic from "next/dynamic";

const DashboardPageView = dynamic(
  () => import("pages-sections/vendor-dashboard/dashboard/page-view/dashboard"),
  {
    loading: () => null,
    ssr: false
  }
);

export default function DashboardClient() {
  return <DashboardPageView />;
}
