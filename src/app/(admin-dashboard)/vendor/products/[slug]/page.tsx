import { Metadata } from "next";
import VendorProductEditClient from "./vendor-product-edit-client";

export const metadata: Metadata = {
  title: "Edit Product - Bazaar Next.js E-commerce Template",
  description:
    "Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store",
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};

export default async function VendorProductEditPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <VendorProductEditClient productId={slug} />;
}
