import { Metadata } from "next";
import PaymentMethodsClient from "./payment-methods-client";

export const metadata: Metadata = {
  title: "Demo Payments - Bazaar Next.js E-commerce Template",
  description: `Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store`,
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};

// ==============================================================
interface Props {
  searchParams: Promise<{ page: string }>;
}
// ==============================================================

export default async function PaymentMethods({ searchParams }: Props) {
  const { page } = await searchParams;
  return <PaymentMethodsClient page={page} />;
}
