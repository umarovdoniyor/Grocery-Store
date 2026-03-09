"use client";

import AsyncState from "components/AsyncState";
import { useProtectedRoute } from "hooks/useProtectedRoute";
import { ProfilePageView } from "pages-sections/customer-dashboard/profile/page-view";

export default function ProfileClient() {
  const { user, isLoading, isAuthenticated } = useProtectedRoute();

  if (isLoading) {
    return <AsyncState loading />;
  }

  if (!isAuthenticated) {
    return <AsyncState loading />;
  }

  if (!user) {
    return <AsyncState error="Unable to load profile." />;
  }

  return <ProfilePageView user={user} />;
}
