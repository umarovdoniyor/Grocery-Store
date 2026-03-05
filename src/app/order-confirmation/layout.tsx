import type { PropsWithChildren } from "react";
import ShopLayout1 from "components/layouts/shop-layout-1";
import ProtectedRoute from "components/auth/ProtectedRoute";
import { getLayoutData } from "utils/services/layout-data";

export default async function Layout1({ children }: PropsWithChildren) {
  const data = await getLayoutData();
  return (
    <ProtectedRoute requiredRole="customer">
      <ShopLayout1 data={data}>{children}</ShopLayout1>
    </ProtectedRoute>
  );
}
