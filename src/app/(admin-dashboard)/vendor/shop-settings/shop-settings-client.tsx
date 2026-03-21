"use client";

import dynamic from "next/dynamic";

const ShopSettingsPageView = dynamic(
  () => import("pages-sections/vendor-dashboard/shop-settings/page-view/shop-settings"),
  {
    loading: () => null,
    ssr: false
  }
);

export default function ShopSettingsClient() {
  return <ShopSettingsPageView />;
}
