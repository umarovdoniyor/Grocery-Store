import { Metadata } from "next";
import OrderDetailsPageClient from "./order-details-page-client";
// CUSTOM DATA MODEL
import { IdParams } from "models/Common";

export const metadata: Metadata = {
  title: "Order Details - Bazaar Next.js E-commerce Template",
  description: `Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store`,
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};

export default async function OrderDetails({ params }: IdParams) {
  const { id } = await params;

  return <OrderDetailsPageClient id={id} />;
}
