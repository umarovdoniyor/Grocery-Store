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

  useEffect(() => {
    if (isLoading) return;

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // Check role if required
    if (requiredRole && user) {
      const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

      if (!allowedRoles.includes(user.role)) {
        // Redirect based on user role
        switch (user.role) {
          case "customer":
            router.push("/");
            break;
          case "vendor":
            router.push("/vendor/dashboard");
            break;
          case "admin":
            router.push("/admin/orders");
            break;
          default:
            router.push("/");
        }
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRole, redirectTo, router]);

  return { user, isAuthenticated, isLoading };
}
