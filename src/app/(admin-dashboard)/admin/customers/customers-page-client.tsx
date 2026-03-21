"use client";

import dynamic from "next/dynamic";

const CustomersClient = dynamic(() => import("./customers-client"), {
  loading: () => null,
  ssr: false
});

export default function CustomersPageClient() {
  return <CustomersClient />;
}
