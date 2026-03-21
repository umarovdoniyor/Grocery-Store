import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductQuickView from "./components/product-quick-view";

import { getQuickViewProductBySlug } from "utils/services/product-details";
import { SlugParams } from "models/Common";

const getCachedQuickViewProduct = cache(getQuickViewProductBySlug);

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCachedQuickViewProduct(slug);

  if (!product) notFound();

  return {
    title: product.title + " - Bazaar Next.js E-commerce Template",
    description: "Bazaar is a React Next.js E-commerce template.",
    authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
    keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
  };
}

export default async function QuickViewPage({ params }: SlugParams) {
  const { slug } = await params;
  const product = await getCachedQuickViewProduct(slug);

  if (!product) notFound();

  return <ProductQuickView product={product} />;
}
