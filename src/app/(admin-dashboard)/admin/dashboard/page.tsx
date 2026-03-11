import { Metadata } from "next";
import AdminDashboardPageView from "pages-sections/admin-dashboard/dashboard/page-view/dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard - Bazaar Next.js E-commerce Template",
  description:
    "Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store",
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};

export default async function AdminDashboardPage() {
  return <AdminDashboardPageView />;
}
