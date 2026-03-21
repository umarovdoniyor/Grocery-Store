import { Metadata } from "next";
import { redirect } from "next/navigation";
// PAGE VIEW COMPONENT
import { ProductSearchPageView } from "pages-sections/product-details/page-view";
import { getCatalogFilters, getCatalogProducts } from "utils/services/storefront-catalog";

export const metadata: Metadata = {
  title: "Product Search - Bazaar Next.js E-commerce Template",
  description:
    "Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store",
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};

// ==============================================================
interface Props {
  searchParams: Promise<{
    q: string;
    tag: string;
    sale: string;
    sales: string;
    page: string;
    sort: string;
    prices: string;
    colors: string;
    brands: string;
    rating: string;
    category: string;
  }>;
}
// ==============================================================

const LEGACY_DEAL_REDIRECTS: Record<string, string> = {
  "flash-sale": "/deals/flash-sales",
  "weekly-deal": "/deals/weekly-deals",
  clearance: "/deals/clearance"
};

export default async function ProductSearch({ searchParams }: Props) {
  const { q, tag, page, sort, sale, sales, prices, colors, brands, rating, category } =
    await searchParams;

  const legacyDealRedirect = tag ? LEGACY_DEAL_REDIRECTS[tag] : undefined;

  if (legacyDealRedirect) {
    redirect(legacyDealRedirect);
  }

  const [filters, data] = await Promise.all([
    getCatalogFilters(),
    getCatalogProducts({ q, page, sort, sale, sales, prices, colors, brands, rating, category })
  ]);

  return (
    <ProductSearchPageView
      filters={filters}
      products={data.products}
      pageCount={data.pageCount}
      totalProducts={data.totalProducts}
      lastIndex={data.lastIndex}
      firstIndex={data.firstIndex}
    />
  );
}
