import { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderDetailsPageView } from "pages-sections/customer-dashboard/orders/page-view";
import { getCustomerOrderById } from "utils/services/customer-orders";
// CUSTOM DATA MODEL
import { IdParams } from "models/Common";

export async function generateMetadata({ params }: IdParams): Promise<Metadata> {
  const { id } = await params;
  const result = await getCustomerOrderById(id);
  if (!result.success || !result.order) notFound();

  return {
    title: result.order.id + " - Bazaar Next.js E-commerce Template",
    description: "Bazaar is a React Next.js E-commerce template.",
    authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
    keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
  };
}

export default async function OrderDetails({ params }: IdParams) {
  const { id } = await params;
  const result = await getCustomerOrderById(id);

  if (!result.success || !result.order) notFound();

  return <OrderDetailsPageView order={result.order} />;
}
