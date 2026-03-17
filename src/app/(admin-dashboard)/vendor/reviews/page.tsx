import { Metadata } from "next";
import { ReviewsPageView } from "pages-sections/vendor-dashboard/reviews/page-view";
import type { ProductReviewStatus } from "../../../../../libs/review";

export const metadata: Metadata = {
  title: "Reviews - Bazaar Next.js E-commerce Template",
  description: `Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store`,
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};

const REVIEW_STATUS_SET = new Set<ProductReviewStatus>(["PUBLISHED", "PENDING", "REJECTED", "HIDDEN"]);

export default async function Reviews({
  searchParams
}: {
  searchParams?: { status?: string } | Promise<{ status?: string }>;
}) {
  const query = await Promise.resolve(searchParams ?? {});
  const rawStatus = (query.status || "").toUpperCase();
  const selectedStatus = REVIEW_STATUS_SET.has(rawStatus as ProductReviewStatus)
    ? (rawStatus as ProductReviewStatus)
    : "ALL";

  return (
    <ReviewsPageView selectedStatus={selectedStatus} />
  );
}
