import { Metadata } from "next";
import AdminScopeNotice from "components/admin/AdminScopeNotice";

export const metadata: Metadata = {
  title: "Earning History - Bazaar Next.js E-commerce Template",
  description: `Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store`,
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};

export default async function EarningHistory() {
  return (
    <AdminScopeNotice
      title="Earning History"
      description="Finance reporting APIs are not included in this portfolio milestone."
    />
  );
}
