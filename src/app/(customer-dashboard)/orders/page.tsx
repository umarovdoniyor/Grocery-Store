import type { Metadata } from "next";
import { OrdersPageView } from "pages-sections/customer-dashboard/orders/page-view";
import { getCustomerOrders } from "utils/services/customer-orders";

export const metadata: Metadata = {
  title: "Orders - Bazaar Next.js E-commerce Template",
  description:
    "Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store",
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};

// ==============================================================
interface Props {
  searchParams: Promise<{ page: string }>;
}
// ==============================================================

export default async function Orders({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = Number.parseInt(page || "1", 10) || 1;
  const data = await getCustomerOrders(currentPage);

  if (!data.success || !data.orders) {
    return <div>Failed to load</div>;
  }

  return <OrdersPageView orders={data.orders} totalPages={data.totalPages || 1} />;
}
