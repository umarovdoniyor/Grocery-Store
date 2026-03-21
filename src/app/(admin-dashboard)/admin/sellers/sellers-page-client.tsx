"use client";

import dynamic from "next/dynamic";

const SellersClient = dynamic(() => import("./sellers-client"), {
  loading: () => null,
  ssr: false
});

export default function SellersPageClient() {
  return <SellersClient />;
}