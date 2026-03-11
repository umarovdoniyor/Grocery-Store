import { Metadata } from "next";
import AdminScopeNotice from "components/admin/AdminScopeNotice";

export const metadata: Metadata = {
  title: "Edit Brand - Bazaar Next.js E-commerce Template",
  description: `Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store`,
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};

export default function BrandEdit() {
  return (
    <AdminScopeNotice
      title="Edit Brand"
      description="Brand edit workflow is intentionally deferred in this portfolio scope."
    />
  );
}
