import { redirect } from "next/navigation";

export default async function ProductsIndexPage() {
  redirect("/products/search");
}
