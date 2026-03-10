"use client";

import { useCallback, useEffect, useMemo } from "react";
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

const AUTH_PATHS = new Set(["/login", "/register", "/reset-password"]);

const toSafeNextPath = (value: string) => {
  let candidate = value.trim();

  // Decode a few layers in case next was double-encoded.
  for (let i = 0; i < 3; i += 1) {
    if (!/%[0-9A-Fa-f]{2}/.test(candidate)) break;
    try {
      const decoded = decodeURIComponent(candidate);
      if (decoded === candidate) break;
      candidate = decoded;
    } catch {
      break;
    }
  }

  if (!candidate.startsWith("/") || candidate.startsWith("//")) return "/";

  const pathOnly = candidate.split("?")[0];
  if (AUTH_PATHS.has(pathOnly)) return "/";

  return candidate;
};

export function useProtectedRoute(options: UseProtectedRouteOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { requiredRole, redirectTo = "/login" } = options;
  const allowedRoles = useMemo(
    () => (Array.isArray(requiredRole) ? requiredRole : requiredRole ? [requiredRole] : []),
    [requiredRole]
  );
  const currentUserRole = user?.role ?? "customer";
  const hasRequiredRole =
    !requiredRole || (Boolean(user) && allowedRoles.includes(currentUserRole));
  const canAccess = !isLoading && isAuthenticated && hasRequiredRole;

  const buildAuthRedirect = useCallback(() => {
    if (AUTH_PATHS.has(pathname)) {
      return redirectTo;
    }

    const currentQuery = searchParams.toString();
    const currentPath = currentQuery ? `${pathname}?${currentQuery}` : pathname;
    const safeCurrentPath = toSafeNextPath(currentPath);
    const separator = redirectTo.includes("?") ? "&" : "?";

    if (redirectTo.includes("next=")) return redirectTo;
    if (redirectTo.startsWith("/login") || redirectTo.startsWith("/register")) {
      return `${redirectTo}${separator}next=${encodeURIComponent(safeCurrentPath)}`;
    }

    return redirectTo;
  }, [pathname, redirectTo, searchParams]);

  useEffect(() => {
    if (isLoading) return;

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
      router.replace(buildAuthRedirect());
      return;
    }

    // Check role if required
    if (requiredRole && user) {
      if (!allowedRoles.includes(currentUserRole)) {
        const landingPath = ROLE_LANDING_PATH[currentUserRole] || "/";
        router.replace(landingPath);
      }
    }
  }, [
    allowedRoles,
    buildAuthRedirect,
    currentUserRole,
    isAuthenticated,
    isLoading,
    requiredRole,
    router,
    user
  ]);

  return { user, isAuthenticated, isLoading, canAccess };
}
