import { Metadata } from "next";
import AdminScopeNotice from "components/admin/AdminScopeNotice";

export const metadata: Metadata = {
  title: "Product Create - Bazaar Next.js E-commerce Template",
  description: `Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store`,
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};

export default function ProductCreate() {
  return (
    <AdminScopeNotice
      title="Product Creation Is Vendor-Only"
      description="Backend policy allows product creation only for authenticated vendors. Use vendor accounts to create products, while admins curate featured products and moderation."
    />
  );
}
