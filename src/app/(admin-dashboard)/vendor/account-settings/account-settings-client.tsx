"use client";

import dynamic from "next/dynamic";

const AccountSettingsPageView = dynamic(
  () => import("pages-sections/vendor-dashboard/account-settings/page-view/account-settings"),
  {
    loading: () => null,
    ssr: false
  }
);

export default function AccountSettingsClient() {
  return <AccountSettingsPageView />;
}
