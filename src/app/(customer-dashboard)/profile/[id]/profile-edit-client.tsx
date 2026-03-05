"use client";

import AsyncState from "components/AsyncState";
import { useAuth } from "contexts/AuthContext";
import { ProfileEditPageView } from "pages-sections/customer-dashboard/profile/page-view";

export default function ProfileEditClient() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <AsyncState loading />;
  }

  if (!user) {
    return <AsyncState error="Unable to load profile." />;
  }

  return <ProfileEditPageView user={user} />;
}
