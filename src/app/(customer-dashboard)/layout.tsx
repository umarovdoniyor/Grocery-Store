import type { PropsWithChildren } from "react";
import ShopLayout1 from "components/layouts/shop-layout-1";
import ProtectedRoute from "components/auth/ProtectedRoute";
// API FUNCTIONS
import api from "utils/__api__/layout";

export default async function Layout1({ children }: PropsWithChildren) {
  const data = await api.getLayoutData();

  if (!data) {
    return <ProtectedRoute requiredRole="customer">{children}</ProtectedRoute>;
  }

  return (
    <ProtectedRoute requiredRole="customer">
      <ShopLayout1 data={data}>{children}</ShopLayout1>
    </ProtectedRoute>
  );
}
