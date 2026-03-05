import { Metadata } from "next";
import { BrandsPageView } from "pages-sections/vendor-dashboard/brands/page-view";
import { getAdminBrands } from "utils/services/admin-dashboard";

export const metadata: Metadata = {
  title: "Brands - Bazaar Next.js E-commerce Template",
  description: `Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store`,
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};

export default async function Brands() {
  const brands = await getAdminBrands();
  return <BrandsPageView brands={brands} />;
}
