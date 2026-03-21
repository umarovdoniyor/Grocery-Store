"use client";

import dynamic from "next/dynamic";

const AdminDashboardPageView = dynamic(
  () => import("pages-sections/admin-dashboard/dashboard/page-view/dashboard"),
  {
    loading: () => null,
    ssr: false
  }
);

export default function AdminDashboardClient() {
  return <AdminDashboardPageView />;
}
