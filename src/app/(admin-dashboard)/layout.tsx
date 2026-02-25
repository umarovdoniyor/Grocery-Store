import { PropsWithChildren } from "react";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import ProtectedRoute from "components/auth/ProtectedRoute";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ProtectedRoute requiredRole={["admin", "vendor"]}>
      <VendorDashboardLayout>{children}</VendorDashboardLayout>
    </ProtectedRoute>
  );
}
