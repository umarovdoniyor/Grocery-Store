import { Metadata } from "next";
import { ReviewsPageView } from "pages-sections/vendor-dashboard/reviews/page-view";
import { getVendorReviews } from "utils/services/vendor-dashboard";

export const metadata: Metadata = {
  title: "Reviews - Bazaar Next.js E-commerce Template",
  description: `Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store`,
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};

export default async function Reviews() {
  const payload = await getVendorReviews();
  return (
    <ReviewsPageView
      reviews={payload.reviews}
      summary={payload.summary}
      total={payload.total}
      error={payload.error}
    />
  );
}
