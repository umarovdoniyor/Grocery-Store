"use client";

import dynamic from "next/dynamic";

const OrderDetailsClient = dynamic(() => import("./order-details-client"), {
  loading: () => null,
  ssr: false
});

type Props = {
  id: string;
};

export default function OrderDetailsPageClient({ id }: Props) {
  return <OrderDetailsClient id={id} />;
}