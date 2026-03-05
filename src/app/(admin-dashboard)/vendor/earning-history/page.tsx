import { Metadata } from "next";
import { VendorEarningHistoryPageView } from "pages-sections/vendor-dashboard/v-earning-history/page-view";
import { getVendorEarningHistory } from "utils/services/vendor-dashboard";

export const metadata: Metadata = {
  title: "Earning History - Bazaar Next.js E-commerce Template",
  description: `Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store`,
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};

export default async function EarningHistory() {
  const earnings = await getVendorEarningHistory();
  return <VendorEarningHistoryPageView earnings={earnings} />;
}
