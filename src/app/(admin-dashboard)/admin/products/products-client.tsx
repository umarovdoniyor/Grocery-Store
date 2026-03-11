"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AsyncState from "components/AsyncState";
import { ProductsPageView } from "pages-sections/vendor-dashboard/products/page-view";
import {
  AdminProductRow,
  fetchAdminProductsForUiByQuery,
  removeAdminProductForUi,
  updateAdminProductPublishedForUi
} from "utils/services/admin-products";

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<AdminProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingProductId, setUpdatingProductId] = useState<string | null>(null);
  const [removingProductId, setRemovingProductId] = useState<string | null>(null);

  const query = searchParams.get("q")?.trim() || "";
  const statusRaw = searchParams.get("status")?.trim().toUpperCase() || "";
  const status = ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(statusRaw)
    ? (statusRaw as "DRAFT" | "PUBLISHED" | "ARCHIVED")
    : undefined;

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const response = await fetchAdminProductsForUiByQuery({
        page: 1,
        limit: 100,
        search: query || undefined,
        status
      });

      if (response.error) {
        setError(response.error);
      } else {
        setError(null);
      }

      setProducts(response.products);
      setLoading(false);
    };

    loadProducts();
  }, [query, status]);

  const handleTogglePublished = async (product: AdminProductRow) => {
    setUpdatingProductId(product.id);

    const response = await updateAdminProductPublishedForUi({
      productId: product.id,
      published: !product.published
    });

    if (!response.success || response.published === undefined) {
      setError(response.error || "Failed to update product status");
      setUpdatingProductId(null);
      return;
    }

    setProducts((prev) =>
      prev.map((item) =>
        item.id === product.id ? { ...item, published: response.published as boolean } : item
      )
    );
    setUpdatingProductId(null);
  };

  const handleRemoveProduct = async (product: AdminProductRow) => {
    setRemovingProductId(product.id);

    const response = await removeAdminProductForUi(product.id);

    if (!response.success) {
      setError(response.error || "Failed to remove product");
      setRemovingProductId(null);
      return;
    }

    setProducts((prev) => prev.filter((item) => item.id !== product.id));
    setRemovingProductId(null);
  };

  if (loading) {
    return <AsyncState loading />;
  }

  if (error) {
    return <AsyncState error={error} />;
  }

  return (
    <ProductsPageView
      products={products}
      updatingProductId={updatingProductId}
      removingProductId={removingProductId}
      onTogglePublished={handleTogglePublished}
      onRemoveProduct={handleRemoveProduct}
    />
  );
}
