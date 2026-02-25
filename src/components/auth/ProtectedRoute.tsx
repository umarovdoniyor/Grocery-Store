"use client";

import type { PropsWithChildren } from "react";
import { useProtectedRoute } from "hooks/useProtectedRoute";
import { UserRole } from "models/User.model";

interface ProtectedRouteProps extends PropsWithChildren {
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  redirectTo
}: ProtectedRouteProps) {
  const { isLoading } = useProtectedRoute({ requiredRole, redirectTo });

  if (isLoading) return null;

  return <>{children}</>;
}
