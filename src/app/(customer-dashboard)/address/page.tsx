import type { Metadata } from "next";
import AddressClient from "./address-client";

export const metadata: Metadata = {
  title: "Address - Bazaar Next.js E-commerce Template",
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

export default async function Address({ searchParams }: Props) {
  const { page } = await searchParams;
  return <AddressClient page={page} />;
}
