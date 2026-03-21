"use client";

import dynamic from "next/dynamic";

const OrdersClient = dynamic(() => import("./orders-client"), {
  loading: () => null,
  ssr: false
});

export default function OrdersPageClient() {
  return <OrdersClient />;
}
