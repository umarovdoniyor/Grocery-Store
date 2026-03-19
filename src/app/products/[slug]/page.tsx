import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
// PAGE VIEW COMPONENT
import { ProductDetailsPageView } from "pages-sections/product-details/page-view";
import { getProductBySlug, getRelatedProductsBySlug } from "utils/services/product-details";
// CUSTOM DATA MODEL
import { SlugParams } from "models/Common";

// Deduplicate: generateMetadata and the page component both call this,
// but React cache() ensures only one fetch happens per request.
const getCachedProduct = cache(getProductBySlug);

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCachedProduct(slug);
  if (!product) notFound();

  return {
    title: product.title + " - Bazaar Next.js E-commerce Template",
    description: "Bazaar is a React Next.js E-commerce template.",
    authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
    keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
  };
}

export default async function ProductDetails({ params }: SlugParams) {
  const { slug } = await params;
  const [product, relatedProducts] = await Promise.all([
    getCachedProduct(slug),
    getRelatedProductsBySlug(slug)
  ]);

  if (!product) notFound();

  return <ProductDetailsPageView product={product} relatedProducts={relatedProducts} />;
}
