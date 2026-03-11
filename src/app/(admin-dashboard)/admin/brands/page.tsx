import { Metadata } from "next";
import AdminScopeNotice from "components/admin/AdminScopeNotice";

export const metadata: Metadata = {
  title: "Brands - Bazaar Next.js E-commerce Template",
  description: `Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store`,
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};

export default async function Brands() {
  return (
    <AdminScopeNotice
      title="Brands Module"
      description="Brand CRUD is intentionally out of scope for this portfolio milestone."
    />
  );
}
