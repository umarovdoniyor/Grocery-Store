import type { Metadata } from "next";
import { notFound } from "next/navigation";
// PAGE VIEW COMPONENT
import { ProductDetailsPageView } from "pages-sections/product-details/page-view";
import {
  getFrequentlyBoughtProducts,
  getProductBySlug,
  getRelatedProductsBySlug
} from "utils/services/product-details";
// CUSTOM DATA MODEL
import { SlugParams } from "models/Common";

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
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
  const [product, relatedProducts, frequentlyBought] = await Promise.all([
    getProductBySlug(slug),
    getRelatedProductsBySlug(slug),
    getFrequentlyBoughtProducts()
  ]);

  if (!product) notFound();

  return (
    <ProductDetailsPageView
      product={product}
      relatedProducts={relatedProducts}
      frequentlyBought={frequentlyBought}
    />
  );
}
