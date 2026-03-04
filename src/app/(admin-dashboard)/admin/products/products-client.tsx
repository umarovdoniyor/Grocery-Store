"use client";

import { useEffect, useState } from "react";
import AsyncState from "components/AsyncState";
import { ProductsPageView } from "pages-sections/vendor-dashboard/products/page-view";
import {
  AdminProductRow,
  fetchAdminProductsForUi,
  removeAdminProductForUi,
  updateAdminProductPublishedForUi
} from "utils/services/admin-products";

export default function ProductsClient() {
  const [products, setProducts] = useState<AdminProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingProductId, setUpdatingProductId] = useState<string | null>(null);
  const [removingProductId, setRemovingProductId] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      const response = await fetchAdminProductsForUi();

      if (response.error) {
        setError(response.error);
      }

      setProducts(response.products);
      setLoading(false);
    };

    loadProducts();
  }, []);

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
