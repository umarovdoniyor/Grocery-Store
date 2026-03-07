import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
// PAGE VIEW COMPONENT
import { ShopDetailsPageView } from "pages-sections/shops/page-view";
import { getProductsBySlug } from "utils/services/shop-directory";
// CUSTOM DATA MODEL
import { SlugParams } from "models/Common";

export const metadata: Metadata = {
  title: "Shop Details - Bazaar Next.js E-commerce Template",
  description:
    "Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store",
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};

export default async function ShopDetails({
  params,
  searchParams
}: SlugParams & {
  searchParams?:
    | { page?: string; sort?: string; q?: string }
    | Promise<{ page?: string; sort?: string; q?: string }>;
}) {
  const allowedSorts = new Set(["newest", "popular", "asc", "desc"]);
  const { slug } = await params;
  const query = await Promise.resolve(searchParams ?? {});
  const parsedPage = Number(query?.page || "1");
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;
  const sort = query?.sort && allowedSorts.has(query.sort) ? query.sort : undefined;
  const q = (query?.q || "").trim();

  const data = await getProductsBySlug(slug, { page, sort, q });

  if (!data) notFound();

  if (page > data.meta.totalPages) {
    const params = new URLSearchParams();
    if (sort) params.set("sort", sort);
    if (q) params.set("q", q);
    if (data.meta.totalPages > 1) params.set("page", String(data.meta.totalPages));

    const nextQuery = params.toString();
    redirect(nextQuery ? `/shops/${slug}?${nextQuery}` : `/shops/${slug}`);
  }

  return (
    <ShopDetailsPageView
      shop={data.shop}
      totalProducts={data.meta.totalProducts}
      pageCount={data.meta.totalPages}
      firstIndex={data.meta.firstIndex}
      lastIndex={data.meta.lastIndex}
      selectedSort={sort || "newest"}
    />
  );
}
