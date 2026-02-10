import type { Metadata } from "next";
import ShopLayout3 from "components/layouts/shop-layout-3";
import GroceryOnePageView from "pages-sections/grocery-1/page-view";
// API FUNCTIONS
import api from "utils/__api__/layout";

export const metadata: Metadata = {
  title: "Grocery Store - Fresh Food & Delivery",
  description:
    "Shop fresh groceries online. Fast delivery, great prices. Your online grocery store.",
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["grocery", "online grocery", "food delivery", "fresh produce", "e-commerce"]
};

export default async function IndexPage() {
  const data = await api.getLayoutData();

  return (
    <ShopLayout3 showFooter={false} showMobileMenu={false} data={data}>
      <GroceryOnePageView />
    </ShopLayout3>
  );
}
