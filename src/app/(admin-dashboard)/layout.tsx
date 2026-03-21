"use client";

import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import ProtectedRoute from "components/auth/ProtectedRoute";

const VendorDashboardLayout = dynamic(
  () => import("components/layouts/vendor-dashboard/dashboard-layout"),
  {
    loading: () => null
  }
);

export default function Layout({ children }: PropsWithChildren) {
  const pathname = usePathname();

  const requiredRole = pathname.startsWith("/admin") ? "admin" : "vendor";

  return (
    <ProtectedRoute requiredRole={requiredRole} redirectTo="/">
      <VendorDashboardLayout>{children}</VendorDashboardLayout>
    </ProtectedRoute>
  );
}
