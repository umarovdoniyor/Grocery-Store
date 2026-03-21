import type { PropsWithChildren } from "react";
import ProtectedRoute from "components/auth/ProtectedRoute";

export default function Layout1({ children }: PropsWithChildren) {
  return <ProtectedRoute requiredRole="customer">{children}</ProtectedRoute>;
}
