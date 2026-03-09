"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "contexts/AuthContext";
import { UserRole } from "models/User.model";

interface UseProtectedRouteOptions {
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
}

const ROLE_LANDING_PATH: Record<UserRole, string> = {
  customer: "/profile",
  vendor: "/vendor/dashboard",
  admin: "/admin/orders"
};

export function useProtectedRoute(options: UseProtectedRouteOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { requiredRole, redirectTo = "/login" } = options;

  const buildAuthRedirect = () => {
    const currentQuery = searchParams.toString();
    const currentPath = currentQuery ? `${pathname}?${currentQuery}` : pathname;
    const safeCurrentPath = currentPath.startsWith("/") ? currentPath : "/";
    const separator = redirectTo.includes("?") ? "&" : "?";

    if (redirectTo.includes("next=")) return redirectTo;
    if (redirectTo.startsWith("/login") || redirectTo.startsWith("/register")) {
      return `${redirectTo}${separator}next=${encodeURIComponent(safeCurrentPath)}`;
    }

    return redirectTo;
  };

  useEffect(() => {
    if (isLoading) return;

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
      router.replace(buildAuthRedirect());
      return;
    }

    // Check role if required
    if (requiredRole && user) {
      const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      const currentUserRole = user.role ?? "customer";

      if (!allowedRoles.includes(currentUserRole)) {
        const landingPath = ROLE_LANDING_PATH[currentUserRole] || "/";
        router.replace(landingPath);
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRole, redirectTo, router, pathname, searchParams]);

  return { user, isAuthenticated, isLoading };
}
