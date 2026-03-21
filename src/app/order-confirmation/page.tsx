import type { Metadata } from "next";
import { OrderConfirmationPageView } from "pages-sections/order-confirmation";

export const metadata: Metadata = {
  title: "Order Confirmation - Bazaar Next.js E-commerce Template",
  description:
    "Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store",
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};

type OrderConfirmationSearchParams = {
  method?: string;
  orderNo?: string;
  orderId?: string;
};

export default async function OrderConfirmation({
  searchParams
}: {
  searchParams: Promise<OrderConfirmationSearchParams>;
}) {
  const params = await searchParams;

  return (
    <OrderConfirmationPageView
      paymentMethod={params.method}
      orderNo={params.orderNo}
      orderId={params.orderId}
    />
  );
}
