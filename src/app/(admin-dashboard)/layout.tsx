"use client";

import { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import ProtectedRoute from "components/auth/ProtectedRoute";

export default function Layout({ children }: PropsWithChildren) {
  const pathname = usePathname();

  const requiredRole = pathname.startsWith("/admin") ? "admin" : "vendor";

  return (
    <ProtectedRoute requiredRole={requiredRole} redirectTo="/">
      <VendorDashboardLayout>{children}</VendorDashboardLayout>
    </ProtectedRoute>
  );
}
