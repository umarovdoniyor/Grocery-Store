import { Metadata } from "next";
import { VendorPayoutsPageView } from "pages-sections/vendor-dashboard/v-payouts/page-view";
import { getVendorPayouts } from "utils/services/vendor-dashboard";

export const metadata: Metadata = {
  title: "Vendor Payouts - Bazaar Next.js E-commerce Template",
  description: `Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store`,
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};

export default async function VendorPayouts() {
  const payouts = await getVendorPayouts();
  return <VendorPayoutsPageView payouts={payouts} />;
}
