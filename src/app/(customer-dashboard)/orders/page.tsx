import type { Metadata } from "next";
import OrdersClient from "./orders-client";

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

  return <OrdersClient page={page} />;
}
