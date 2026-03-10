"use client";

import { useEffect, useState } from "react";
import AsyncState from "components/AsyncState";
import { ProductsPageView } from "pages-sections/vendor-dashboard/products/page-view";
import {
  VendorProductRow,
  fetchVendorProductsForUi,
  removeVendorProductForUi,
  updateVendorProductPublishedForUi
} from "utils/services/vendor-products";

export default function ProductsClient() {
  const [products, setProducts] = useState<VendorProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingProductId, setUpdatingProductId] = useState<string | null>(null);
  const [removingProductId, setRemovingProductId] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      const response = await fetchVendorProductsForUi();

      if (response.error) {
        setError(response.error);
      }

      setProducts(response.products);
      setLoading(false);
    };

    loadProducts();
  }, []);

  const handleTogglePublished = async (product: VendorProductRow) => {
    setUpdatingProductId(product.id);

    const response = await updateVendorProductPublishedForUi({
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

  const handleRemoveProduct = async (product: VendorProductRow) => {
    setRemovingProductId(product.id);

    const response = await removeVendorProductForUi(product.id);

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
      basePath="/vendor/products"
      updatingProductId={updatingProductId}
      removingProductId={removingProductId}
      onTogglePublished={handleTogglePublished}
      onRemoveProduct={handleRemoveProduct}
    />
  );
}
