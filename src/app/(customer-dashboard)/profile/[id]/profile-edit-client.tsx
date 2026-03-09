"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AsyncState from "components/AsyncState";
import { useProtectedRoute } from "hooks/useProtectedRoute";
import { ProfileEditPageView } from "pages-sections/customer-dashboard/profile/page-view";

export default function ProfileEditClient() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const { user, isLoading, isAuthenticated } = useProtectedRoute();
  const profileId = params?.id || "";

  useEffect(() => {
    if (!isLoading && user?.id && profileId && user.id !== profileId) {
      router.replace(`/profile/${user.id}`);
    }
  }, [isLoading, profileId, router, user?.id]);

  if (isLoading) {
    return <AsyncState loading />;
  }

  if (!isAuthenticated) {
    return <AsyncState loading />;
  }

  if (!user || (profileId && user.id !== profileId)) {
    return <AsyncState error="Unable to load profile." />;
  }

  return <ProfileEditPageView user={user} />;
}
