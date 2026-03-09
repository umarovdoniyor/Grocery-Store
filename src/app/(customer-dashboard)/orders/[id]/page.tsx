import { Metadata } from "next";
import OrderDetailsClient from "pages-sections/customer-dashboard/orders/page-view/order-details-client";
// CUSTOM DATA MODEL
import { IdParams } from "models/Common";

export const metadata: Metadata = {
  title: "Order Details - Bazaar Next.js E-commerce Template",
  description: "Bazaar is a React Next.js E-commerce template.",
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};

export default async function OrderDetails({ params }: IdParams) {
  const { id } = await params;

  return <OrderDetailsClient orderId={id} />;
}
