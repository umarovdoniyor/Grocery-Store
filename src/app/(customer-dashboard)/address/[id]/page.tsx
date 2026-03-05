import { Metadata } from "next";
import AddressDetailsClient from "./address-details-client";
// CUSTOM DATA MODEL
import { IdParams } from "models/Common";

export const metadata: Metadata = {
  title: "Address Details - Bazaar Next.js E-commerce Template",
  description: "Bazaar is a React Next.js E-commerce template.",
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};

export default async function Address({ params }: IdParams) {
  const { id } = await params;
  return <AddressDetailsClient id={id} />;
}
