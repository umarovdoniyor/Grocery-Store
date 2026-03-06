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
  searchParams?: { page?: string } | Promise<{ page?: string }>;
}) {
  const params = await Promise.resolve(searchParams ?? {});
  const rawPage = params?.page;
  const parsedPage = Number(rawPage || "1");
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;

  const { shops, meta } = await getShopList(page);

  if (page > meta.totalPages) {
    const target = meta.totalPages <= 1 ? "/shops" : `/shops?page=${meta.totalPages}`;
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
    />
  );
}
