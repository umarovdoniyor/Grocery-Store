"use client";

import { useEffect, useState } from "react";
import AsyncState from "components/AsyncState";
import { useAuth } from "contexts/AuthContext";
import { WishListPageView } from "pages-sections/customer-dashboard/wish-list";
import { getCustomerWishlistProducts } from "utils/services/customer-dashboard";
import type Product from "models/Product.model";

type Props = { page?: string };

export default function WishListClient({ page }: Props) {
  const { isAuthenticated, isLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      setLoading(false);
      setError("Please login to view your wishlist.");
      return;
    }

    let active = true;
    const currentPage = Number.parseInt(page || "1", 10) || 1;

    const load = async () => {
      setLoading(true);
      setError(null);

      const data = await getCustomerWishlistProducts(currentPage);
      if (!active) return;

      if (!data.success) {
        setProducts([]);
        setTotalPages(1);
        setError(data.error || "Failed to load wishlist");
      } else {
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
      }

      setLoading(false);
    };

    load();

    return () => {
      active = false;
    };
  }, [isAuthenticated, isLoading, page]);

  if (isLoading || loading) return <AsyncState loading />;
  if (error) return <AsyncState error={error} />;
  if (products.length === 0) return <AsyncState error="Your wishlist is empty." />;

  return <WishListPageView products={products} totalPages={totalPages} />;
}
