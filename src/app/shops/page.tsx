import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getShopList } from "utils/services/shop-directory";
// PAGE VIEW COMPONENT
import { ShopsPageView } from "pages-sections/shops/page-view";

export const metadata: Metadata = {
  title: "Shops - Bazaar Next.js E-commerce Template",
  description:
    "Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store",
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};

export default async function Shops({
  searchParams
}: {
  searchParams?: { page?: string; q?: string; sort?: string } | Promise<{ page?: string; q?: string; sort?: string }>;
}) {
  const params = await Promise.resolve(searchParams ?? {});
  const rawPage = params?.page;
  const parsedPage = Number(rawPage || "1");
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;
  const allowedSorts = new Set(["newest", "oldest", "az", "za", "popular"]);
  const sort = params?.sort && allowedSorts.has(params.sort) ? params.sort : "newest";
  const q = (params?.q || "").trim();

  const { shops, meta } = await getShopList(page, { q, sort });

  if (page > meta.totalPages) {
    const nextParams = new URLSearchParams();
    if (q) nextParams.set("q", q);
    if (sort && sort !== "newest") nextParams.set("sort", sort);
    if (meta.totalPages > 1) nextParams.set("page", String(meta.totalPages));

    const target = nextParams.toString() ? `/shops?${nextParams.toString()}` : "/shops";
    redirect(target);
  }

  if (!shops) return notFound();

  return (
    <ShopsPageView
      shops={shops}
      lastIndex={meta.lastIndex}
      totalPages={meta.totalPages}
      firstIndex={meta.firstIndex}
      totalShops={meta.totalShops}
      selectedSort={sort}
    />
  );
}
