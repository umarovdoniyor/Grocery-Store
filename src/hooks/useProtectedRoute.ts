"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "contexts/AuthContext";
import { UserRole } from "models/User.model";

interface UseProtectedRouteOptions {
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
}

export function useProtectedRoute(options: UseProtectedRouteOptions = {}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { requiredRole, redirectTo = "/login" } = options;

  const roleLandingPath: Record<UserRole, string> = {
    customer: "/profile",
    vendor: "/vendor/dashboard",
    admin: "/admin/orders"
  };

  useEffect(() => {
    if (isLoading) return;

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }

    // Check role if required
    if (requiredRole && user) {
      const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      const currentUserRole = user.role ?? "customer";

      if (!allowedRoles.includes(currentUserRole)) {
        const landingPath = roleLandingPath[currentUserRole] || "/";
        router.replace(landingPath);
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRole, redirectTo, router]);

  return { user, isAuthenticated, isLoading };
}
